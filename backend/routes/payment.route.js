import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

// Rota para criar uma sessão de checkout no Stripe.
// É protegida para garantir que apenas um usuário logado possa iniciar um pagamento.
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
// Rota para finalizar a compra após o pagamento bem-sucedido no Stripe.
// Também é protegida para associar o pedido ao usuário correto.
router.post("/checkout-success", protectRoute, checkoutSuccess);

// Exporta o router para ser usado no arquivo principal do servidor (server.js).
export default router;
