import mongoose from "mongoose";

// Define um sub-schema para o endereço de entrega.
// Usar um sub-schema ajuda a organizar e reutilizar a estrutura do endereço.
const shippingAddressSchema = new mongoose.Schema({
	city: { type: String },
	country: { type: String },
	line1: { type: String }, // Rua, número
	line2: { type: String }, // Bairro, complemento
	postal_code: { type: String },
	state: { type: String },
}, { _id: false }); // Impede que o Mongoose crie um _id para o subdocumento de endereço.


// Define o schema principal para os pedidos no banco de dados.
const orderSchema = new mongoose.Schema(
	{
		// Número de identificação único para o pedido, facilitando a busca e referência.
		orderNumber: {
			type: String,
			required: true,
			unique: true,
		},
		// Referência ao usuário que fez o pedido.
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Aponta para o model 'User'.
			required: true,
		},
		// Um array de objetos, onde cada objeto representa um item comprado no pedido.
		products: [
			{
				// Referência ao documento do produto.
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				// Quantidade de unidades daquele produto específico.
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				// Preço unitário do produto no momento da compra, para manter o histórico correto.
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		// O valor total pago pelo pedido, incluindo produtos e frete.
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		// ID da sessão de checkout do Stripe, para referência e verificação do pagamento.
		stripeSessionId: {
			type: String,
			unique: true,
		},
		// Incorpora o sub-schema de endereço de entrega definido acima.
		shippingAddress: {
			type: shippingAddressSchema
		},
		// Custo do frete para o pedido.
		shippingCost: {
			type: Number,
			required: true,
			default: 0
		},
		// Método de pagamento utilizado (ex: 'card').
		paymentMethod: {
			type: String,
			required: true,
			default: 'card'
		},
		// O status atual do pedido, limitado aos valores definidos no enum.
		status: {
			type: String,
			enum: ["em processamento", "confirmado", "enviado", "recebido"],
			default: "em processamento",
		},
	},
	// Adiciona automaticamente os campos 'createdAt' e 'updatedAt' a cada pedido.
	{ timestamps: true }
);

// Cria o model "Order" a partir do schema, que será usado para interagir com a coleção de pedidos.
const Order = mongoose.model("Order", orderSchema);

export default Order;
