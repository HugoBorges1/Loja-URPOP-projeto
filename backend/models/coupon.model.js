import mongoose from "mongoose";

// Define o schema (a estrutura) para os cupons no banco de dados.
const couponSchema = new mongoose.Schema(
	{
		// O código que o usuário irá inserir para aplicar o desconto.
		code: {
			type: String,
			required: true, // Campo obrigatório.
			unique: true,   // Garante que cada código de cupom seja único na coleção.
		},
		// A porcentagem de desconto que o cupom oferece.
		discountPercentage: {
			type: Number,
			required: true,
			min: 0,         // O valor mínimo do desconto é 0.
			max: 100,       // O valor máximo do desconto é 100.
		},
		// A data em que o cupom expira e não pode mais ser usado.
		expirationDate: {
			type: Date,
			required: true,
		},
		// Um campo booleano para controlar se o cupom está ativo ou não.
		isActive: {
			type: Boolean,
			default: true,  // Por padrão, um novo cupom é criado como ativo.
		},
		// Referência ao usuário a quem o cupom pertence.
		userId: {
			type: mongoose.Schema.Types.ObjectId, // Armazena o ID do usuário.
			ref: "User",                          // Faz referência ao model "User".
			required: true,
			unique: true,                         // Garante que cada usuário possa ter apenas um cupom por vez.
		},
	},
	{
		// Adiciona automaticamente os campos 'createdAt' e 'updatedAt' a cada documento.
		timestamps: true,
	}
);

// Cria o model "Coupon" a partir do schema definido.
const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
