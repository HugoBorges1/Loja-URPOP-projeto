import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { stripe } from "../lib/stripe.js";
import User from "../models/user.model.js";

// Função auxiliar para calcular o custo de envio. Atualmente, retorna um valor fixo.
const calculateShippingCost = () => {
    return 20;
}

// Gera um número de pedido único e complexo para evitar colisões.
async function generateUniqueOrderNumber(userId, productsInCart) {
    // P: Conta quantos pedidos o usuário já fez para gerar um número sequencial.
    const orderCount = await Order.countDocuments({ user: userId });
    const P = orderCount + 1;
    // Q: Soma a quantidade total de itens no carrinho.
    const Q = productsInCart.reduce((sum, item) => sum + item.quantity, 0);
    // C: Pega a primeira letra de cada categoria de produto única no carrinho.
    const productIds = productsInCart.map(p => p.id);
    const productsWithCategory = await Product.find({ _id: { $in: productIds } }).select('category');
    const uniqueCategories = new Set(productsWithCategory.map(p => p.category));
    const C = Array.from(uniqueCategories).map(cat => cat.charAt(0).toUpperCase()).join('');

    let orderNumber;
    let isUnique = false;
    // X: Gera um sufixo aleatório para garantir a unicidade e tenta até encontrar um que não exista.
    while (!isUnique) {
        const X = Math.random().toString(36).substring(2, 8).toUpperCase();
        orderNumber = `P${P}Q${Q}C${C}${X}`;
        const existingOrder = await Order.findOne({ orderNumber });
        if (!existingOrder) {
            isUnique = true;
        }
    }
    return orderNumber;
}

// Controlador para criar uma sessão de checkout no Stripe.
export const createCheckoutSession = async (req, res) => {
    try {
        const { products: cartProducts, couponCode, shippingAddress } = req.body;

        // Valida se o endereço de entrega foi fornecido.
        if (!shippingAddress || !shippingAddress.postalCode) {
            return res.status(400).json({ error: "Endereço de entrega é obrigatório." });
        }

        // Busca os produtos do carrinho no banco de dados para garantir que os preços e detalhes estão corretos.
        const productIds = cartProducts.map(p => p._id);
        const dbProducts = await Product.find({ _id: { $in: productIds } });

        const dbProductMap = new Map(dbProducts.map(p => [p._id.toString(), p]));

        let totalAmount = 0;

        // Formata os itens do carrinho para o formato que a API do Stripe espera.
        const lineItems = cartProducts.map((cartProduct) => {
            const dbProduct = dbProductMap.get(cartProduct._id);
            if (!dbProduct) {
                throw new Error(`Produto com ID ${cartProduct._id} não encontrado no banco de dados.`);
            }

            const amount = Math.round(dbProduct.price * 100); // Converte o preço para centavos.
            totalAmount += amount * cartProduct.quantity;
            return {
                price_data: {
                    currency: "brl",
                    product_data: { name: dbProduct.name, images: [dbProduct.image] },
                    unit_amount: amount,
                },
                quantity: cartProduct.quantity || 1,
            };
        });

        // Adiciona o custo de envio como um item separado na sessão de checkout.
        const shippingCost = calculateShippingCost();
        const shippingCostInCents = Math.round(shippingCost * 100);

        lineItems.push({
            price_data: {
                currency: 'brl',
                product_data: { name: 'Custo de Envio' },
                unit_amount: shippingCostInCents,
            },
            quantity: 1,
        });

        // Verifica se um cupom foi aplicado e busca seus detalhes.
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
        }

        // Cria a sessão de checkout no Stripe com todos os detalhes da compra.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            // Aplica o desconto do cupom, se houver.
            discounts: coupon ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }] : [],
            // 'metadata' é usado para armazenar informações importantes que serão recuperadas após o pagamento.
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(cartProducts.map((p) => ({ id: p._id, quantity: p.quantity, price: p.price }))),
                shippingCost: shippingCost,
                shippingAddress: JSON.stringify(shippingAddress),
            },
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};

// Controlador para lidar com o sucesso do pagamento, chamado após o redirecionamento do Stripe.
export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        // Recupera os detalhes da sessão do Stripe para verificar o status do pagamento.
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent']
        });

        // Confirma se o pagamento foi bem-sucedido.
        if (session.payment_status === "paid") {
            // Verifica se um pedido com esta sessão já foi criado para evitar duplicidade.
            const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

            if (existingOrder) {
                return res.status(200).json({
                    success: true,
                    message: "O pedido já foi processado.",
                    orderId: existingOrder._id,
                    orderNumber: existingOrder.orderNumber,
                });
            }

            // Se um cupom foi usado, desativa-o para que não possa ser usado novamente.
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({ code: session.metadata.couponCode, userId: session.metadata.userId }, { isActive: false });
            }

            // Mapeia o endereço do frontend para o formato do banco de dados.
            const frontendAddress = JSON.parse(session.metadata.shippingAddress);
            const mappedAddress = {
                line1: frontendAddress.street,
                line2: frontendAddress.neighborhood,
                city: frontendAddress.city,
                postal_code: frontendAddress.postalCode,
                country: frontendAddress.country,
                state: frontendAddress.state || null,
            };

            const products = JSON.parse(session.metadata.products);
            const orderNumber = await generateUniqueOrderNumber(session.metadata.userId, products);

            // Cria uma nova instância de 'Order' com todos os dados da compra.
            const newOrder = new Order({
                orderNumber: orderNumber,
                user: session.metadata.userId,
                products: products.map((p) => ({ product: p.id, quantity: p.quantity, price: p.price })),
                totalAmount: session.amount_total / 100, // Converte de centavos para reais.
                stripeSessionId: sessionId,
                shippingAddress: mappedAddress,
                shippingCost: parseFloat(session.metadata.shippingCost),
                paymentMethod: session.payment_intent.payment_method_types[0],
                status: "em processamento",
            });

            // Salva o novo pedido no banco de dados.
            await newOrder.save();
            // Limpa o carrinho de compras do usuário.
            await User.findByIdAndUpdate(session.metadata.userId, { $set: { cartItems: [] } });

            // Retorna uma resposta de sucesso com os detalhes do novo pedido.
            res.status(200).json({
                success: true,
                message: "Pagamento confirmado, pedido criado, e cupom consumido se utilizado.",
                orderId: newOrder._id,
                orderNumber: newOrder.orderNumber,
            });
        } else {
            res.status(400).json({ success: false, message: "Pagamento não confirmado." });
        }
    } catch (error) {
        console.error("Error processing successful checkout:", error);
        res.status(500).json({ message: "Error processing successful checkout", error: error.message });
    }
};

// Função auxiliar para criar um cupom no Stripe dinamicamente para ser aplicado na sessão.
async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once", // O cupom será válido para apenas uma cobrança.
    });

    return coupon.id;
}
