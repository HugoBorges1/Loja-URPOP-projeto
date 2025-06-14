import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema({
	city: { type: String },
	country: { type: String },
	line1: { type: String },
	line2: { type: String },
	postal_code: { type: String },
	state: { type: String },
}, { _id: false });


const orderSchema = new mongoose.Schema(
	{
		orderNumber: {
			type: String,
			required: true,
			unique: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		stripeSessionId: {
			type: String,
			unique: true,
		},
		// --- NOVOS CAMPOS ---
		shippingAddress: {
			type: shippingAddressSchema
		},
		shippingCost: {
			type: Number,
			required: true,
			default: 0
		},
		paymentMethod: {
			type: String,
			required: true,
			default: 'card'
		},
		status: {
			type: String,
			enum: ["em processamento", "confirmado", "enviado", "recebido"],
			default: "em processamento",
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;