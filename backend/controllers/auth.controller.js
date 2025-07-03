import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Função auxiliar para gerar os tokens de acesso e de atualização.
const generateTokens = (userId) => {
	// O 'accessToken' tem uma vida curta (15 minutos) e é usado para acessar rotas protegidas.
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	// O 'refreshToken' tem uma vida longa (7 dias) e é usado para obter um novo 'accessToken' sem precisar fazer login novamente.
	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

// Armazena o 'refreshToken' no Redis com um tempo de expiração de 7 dias.
// O Redis é usado para manter uma lista de 'refreshTokens' válidos.
const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
};

// Define os tokens como cookies no navegador do cliente.
const setCookies = (res, accessToken, refreshToken) => {
	// O 'httpOnly: true' impede que o cookie seja acessado por JavaScript no lado do cliente, aumentando a segurança.
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		// 'secure: true' garante que o cookie só seja enviado em conexões HTTPS (em produção).
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		// Define o tempo de vida do cookie em milissegundos (15 minutos).
		maxAge: 15 * 60 * 1000,
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		// Define o tempo de vida do cookie em milissegundos (7 dias).
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

// Controlador para o cadastro de um novo usuário.
export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		// Verifica se já existe um usuário com o mesmo e-mail.
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		// Cria um novo usuário no banco de dados. A senha é criptografada automaticamente pelo 'pre-save' hook no model 'User'.
		const user = await User.create({ name, email, password });

		// Gera os tokens para o novo usuário.
		const { accessToken, refreshToken } = generateTokens(user._id);
		// Armazena o 'refreshToken' no Redis.
		await storeRefreshToken(user._id, refreshToken);

		// Define os cookies no navegador do usuário.
		setCookies(res, accessToken, refreshToken);

		// Retorna os dados do usuário recém-criado (sem a senha).
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

// Controlador para o login de um usuário existente.
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// Procura o usuário pelo e-mail.
		const user = await User.findOne({ email });

		// Verifica se o usuário existe e se a senha fornecida está correta.
		if (user && (await user.comparePassword(password))) {
			// Se as credenciais estiverem corretas, gera e envia os tokens.
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			// Retorna os dados do usuário (sem a senha).
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			// Se as credenciais forem inválidas, retorna um erro.
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

// Controlador para o logout do usuário.
export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			// Decodifica o 'refreshToken' para obter o ID do usuário.
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			// Remove o 'refreshToken' do Redis, invalidando-o para futuras tentativas de atualização.
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		// Limpa os cookies de token do navegador do cliente.
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para atualizar o 'accessToken' usando o 'refreshToken'.
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		// Verifica a validade do 'refreshToken'.
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		// Busca o token armazenado no Redis para garantir que ele não foi invalidado (ex: por logout).
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		// Compara o token recebido com o armazenado.
		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		// Se o 'refreshToken' for válido, gera um novo 'accessToken'.
		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		// Envia o novo 'accessToken' como um cookie.
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para obter o perfil do usuário autenticado.
export const getProfile = async (req, res) => {
	try {
		// O objeto 'req.user' é adicionado à requisição pelo middleware 'protectRoute'.
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
