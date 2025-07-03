import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rota para buscar os produtos no carrinho do usuário.
router.get("/", protectRoute, getCartProducts);
// Rota para adicionar um novo produto ao carrinho.
router.post("/", protectRoute, addToCart);
// Rota para remover um ou todos os itens do carrinho.
router.delete("/", protectRoute, removeAllFromCart);
// Rota para atualizar a quantidade de um item específico no carrinho.
router.put("/:id", protectRoute, updateQuantity);

// Exporta o router para ser usado no arquivo principal do servidor.
export default router;
