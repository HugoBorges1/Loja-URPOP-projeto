import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

// Rota para buscar o cupom ativo do usuário logado.
// É protegida, então apenas usuários autenticados podem acessá-la.
router.get("/", protectRoute, getCoupon);
// Rota para validar um código de cupom enviado pelo usuário.
// Também é protegida para garantir que a validação seja feita para um usuário logado.
router.post("/validate", protectRoute, validateCoupon);

// Exporta o router para ser usado no arquivo principal do servidor (server.js).
export default router;
