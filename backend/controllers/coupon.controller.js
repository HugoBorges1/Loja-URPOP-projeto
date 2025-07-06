import Coupon from "../models/coupon.model.js";

// Controlador para buscar um cupom ativo associado ao usuário logado.
export const getCoupon = async (req, res) => {
	try {
		// Procura por um cupom que pertença ao usuário (req.user._id) e que esteja ativo (isActive: true).
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
		// Retorna o cupom encontrado ou nulo se não houver nenhum cupom ativo para o usuário.
		res.json(coupon || null);
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para validar um código de cupom fornecido pelo usuário.
export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		// Procura por um cupom com o código fornecido, que pertença ao usuário logado e que esteja ativo.
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

		// Se nenhum cupom for encontrado com esses critérios, retorna um erro 404.
		if (!coupon) {
			return res.status(404).json({ message: "Cupom não encontrado" });
		}

		// Verifica se a data de expiração do cupom já passou.
		if (coupon.expirationDate < new Date()) {
			// Se o cupom estiver expirado, marca-o como inativo no banco de dados.
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Cupom expirado" });
		}

		// Se o cupom for válido, retorna uma mensagem de sucesso com os detalhes do cupom.
		res.json({
			message: "Cupom válido",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
