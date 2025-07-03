import express from "express";
import { login, logout, signup, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rota para o cadastro (criação) de um novo usuário.
router.post("/signup", signup);
// Rota para o login de um usuário existente.
router.post("/login", login);
// Rota para o logout (desconectar) do usuário.
router.post("/logout", logout);
// Rota para renovar o token de acesso de um usuário.
router.post("/refresh-token", refreshToken);
// Rota para buscar o perfil do usuário logado.
// A rota é protegida pelo middleware 'protectRoute', garantindo que apenas usuários autenticados possam acessá-la.
router.get("/profile", protectRoute, getProfile);

// Exporta o router para ser usado no arquivo principal do servidor.
export default router;
