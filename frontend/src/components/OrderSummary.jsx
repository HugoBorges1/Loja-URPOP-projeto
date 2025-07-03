import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import toast from "react-hot-toast";

// Carrega a instância do Stripe de forma assíncrona com a chave pública.
const stripePromise = loadStripe(
	"pk_test_51RO70lRnaoPbHQ5eOzrTPkC47vQzl4f5dLTsszkJvuWo1Trc1ItSQQA60JCyLAa3rGLHOoeai1ex0PpWz0XaqXfa007TaZRUBM"
);

// Componente que exibe o resumo do pedido (subtotal, descontos, total) e o botão para finalizar a compra.
const OrderSummary = () => {
	// Desestrutura os estados e dados necessários do store do carrinho (Zustand).
	const { total, subtotal, coupon, isCouponApplied, cart, shippingAddress } = useCartStore();

	// Calcula e formata os valores para exibição.
	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	// Função para lidar com o processo de pagamento.
	const handlePayment = async () => {
		// Valida se todos os campos do endereço de entrega foram preenchidos.
		for (const key in shippingAddress) {
			if (!shippingAddress[key]) {
				toast.error("Por favor, preencha todos os campos do endereço antes de continuar.");
				return;
			}
		}
		try {
			// Aguarda a instância do Stripe ser carregada.
			const stripe = await stripePromise;
			// Faz uma requisição para o backend para criar uma sessão de checkout no Stripe.
			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon && isCouponApplied ? coupon.code : null,
				shippingAddress: shippingAddress,
			});
			const session = res.data;
			// Redireciona o usuário para a página de pagamento do Stripe usando o ID da sessão recebido.
			const result = await stripe.redirectToCheckout({ sessionId: session.id });
			if (result.error) {
				toast.error("Não foi possível redirecionar para o pagamento.");
			}
		} catch (error) {
			toast.error("Erro ao iniciar a sessão de pagamento.");
		}
	};

	return (
		<div className="rounded-lg bg-gradient-to-r from-[#606cfc] to-[#ff64c4] p-px">
			<motion.div
				className='space-y-4 rounded-lg bg-black p-4 shadow-sm sm:p-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<p className='text-xl font-semibold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>Resumo do Pedido</p>

				<div className='space-y-4'>
					{/* Seção que exibe os detalhes dos custos. */}
					<div className='space-y-2'>
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Preço Original</dt>
							<dd className='text-base font-medium text-white'>R$ {formattedSubtotal}</dd>
						</dl>
						{/* Renderização condicional: Mostra a linha de desconto apenas se um cupom for aplicado. */}
						{isCouponApplied && savings > 0 && (
							<dl className='flex items-center justify-between gap-4'>
								<dt className='text-base font-normal text-gray-300'>Desconto</dt>
								<dd className='text-base font-medium text-pink-400'>-R$ {formattedSavings}</dd>
							</dl>
						)}
						{isCouponApplied && coupon && (
							<dl className='flex items-center justify-between gap-4'>
								<dt className='text-base font-normal text-gray-300'>Cupom ({coupon.code})</dt>
								<dd className='text-base font-medium text-pink-400'>-{coupon.discountPercentage}%</dd>
							</dl>
						)}
						<dl className='flex items-center justify-between gap-4 border-t border-gray-700 pt-2'>
							<dt className='text-base font-bold text-white'>Total</dt>
							<dd className='text-base font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>R$ {formattedTotal}</dd>
						</dl>
					</div>

					{/* Botão principal para iniciar o processo de pagamento. */}
					<motion.button
						className='flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#606cfc] to-[#ff64c4] px-5 py-2.5 text-sm font-medium text-white hover:brightness-125 focus:outline-none focus:ring-4 focus:ring-pink-800'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handlePayment}
					>
						Finalizar Pedido
					</motion.button>

					<div className='flex items-center justify-center gap-2'>
						<span className='text-sm font-normal text-gray-400'>ou</span>
						<Link
							to='/'
							className='inline-flex items-center gap-2 text-sm font-medium group'
						>
							<span className="bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text group-hover:brightness-125 transition-all">
								Continue comprando
							</span>

							<MoveRight
								size={16}
								className="text-[#ff64c4] transition-transform group-hover:translate-x-1"
							/>
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default OrderSummary;
