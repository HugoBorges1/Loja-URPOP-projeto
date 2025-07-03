import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware para proteger rotas que exigem autenticação de usuário.
export const protectRoute = async (req, res, next) => {
	try {
		// Extrai o token de acesso dos cookies da requisição.
		const accessToken = req.cookies.accessToken;

		// Se não houver token de acesso, o usuário não está autorizado.
		if (!accessToken) {
			return res.status(401).json({ message: "Não autorizado - Token de acesso não concedido" });
		}

		try {
			// Verifica e decodifica o token usando o segredo. Se o token for inválido ou expirado, um erro será lançado.
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			// Usa o ID do usuário do token decodificado para encontrar o usuário no banco de dados.
			// O '.select("-password")' garante que o campo da senha não seja retornado.
			const user = await User.findById(decoded.userId).select("-password");

			// Se nenhum usuário for encontrado com o ID do token, o token é inválido.
			if (!user) {
				return res.status(401).json({ message: "Usuário não encontrado" });
			}

			// Anexa o objeto do usuário à requisição (req.user) para que possa ser usado nas próximas rotas.
			req.user = user;

			// Passa para o próximo middleware ou controlador da rota.
			next();
		} catch (error) {
			// Trata especificamente o erro de token expirado, informando o cliente para renovar o token.
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Não autorizado - Token de acesso expirado" });
			}
			throw error; // Lança outros erros de verificação.
		}
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Não autorizado - Token de acesso inválido" });
	}
};

// Middleware para verificar se o usuário autenticado tem permissão de administrador.
// Este middleware deve ser usado SEMPRE DEPOIS do 'protectRoute'.
export const adminRoute = (req, res, next) => {
	// Verifica se o objeto 'req.user' existe (ou seja, o usuário está autenticado) e se sua role é "Admin".
	if (req.user && req.user.role === "Admin") {
		// Se for um administrador, permite o acesso à rota.
		next();
	} else {
		// Se não for um administrador, retorna um erro de "Acesso negado".
		return res.status(403).json({ message: "Access denied - Apenas Admin" });
	}
};
