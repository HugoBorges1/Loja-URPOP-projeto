import express from "express";
import {
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    confirmOrderDelivery
} from "../controllers/order.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rota para o usuário logado buscar seus próprios pedidos. Protegida por 'protectRoute'.
router.get("/my-orders", protectRoute, getMyOrders);
// Rota para o usuário confirmar o recebimento de um pedido. Protegida por 'protectRoute'.
router.patch("/:id/confirm-delivery", protectRoute, confirmOrderDelivery);
// Rota para o administrador buscar todos os pedidos do sistema. Protegida por 'protectRoute' e 'adminRoute'.
router.get("/all", protectRoute, adminRoute, getAllOrders);
// Rota para o administrador atualizar o status de um pedido. Protegida por 'protectRoute' e 'adminRoute'.
router.patch("/:id/status", protectRoute, adminRoute, updateOrderStatus);
// Rota para o administrador deletar um pedido. Protegida por 'protectRoute' e 'adminRoute'.
router.delete("/:id", protectRoute, adminRoute, deleteOrder);

// Exporta o router para ser usado no arquivo principal do servidor.
export default router;
