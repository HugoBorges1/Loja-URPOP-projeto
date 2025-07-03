import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	getProductById,
	toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rota para buscar todos os produtos. Protegida e restrita a administradores.
router.get("/", protectRoute, adminRoute, getAllProducts);
// Rota para buscar produtos em destaque. Rota pública.
router.get("/featured", getFeaturedProducts);
// Rota para buscar produtos por categoria. Rota pública.
router.get("/category/:category", getProductsByCategory);
// Rota para buscar produtos recomendados aleatoriamente. Rota pública.
router.get("/recommendations", getRecommendedProducts);
// Rota para buscar um produto específico pelo seu ID. Deve vir depois de outras rotas GET para evitar conflitos. Rota pública.
router.get("/:id", getProductById);
// Rota para criar um novo produto. Protegida e restrita a administradores.
router.post("/", protectRoute, adminRoute, createProduct);
// Rota para atualizar um produto (neste caso, para marcar/desmarcar como destaque). Protegida e restrita a administradores.
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
// Rota para deletar um produto. Protegida e restrita a administradores.
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

// Exporta o router para ser usado no arquivo principal do servidor.
export default router;
