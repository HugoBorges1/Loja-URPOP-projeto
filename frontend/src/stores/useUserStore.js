import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Cria um store com Zustand para gerenciar o estado global de autenticação do usuário.
export const useUserStore = create((set, get) => ({
	// ---- ESTADOS DO STORE ----
	user: null, // Armazena os dados do usuário logado.
	loading: false, // Flag para indicar se uma operação de login/signup está em andamento.
	checkingAuth: true, // Flag para indicar se a autenticação inicial está sendo verificada.

	// ---- AÇÕES DO STORE ----

	// Ação para cadastrar um novo usuário.
	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		// Validação básica para confirmar se as senhas coincidem.
		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("As senhas não correspondem");
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "Ocorreu um erro");
		}
	},
	// Ação para fazer o login do usuário.
	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", { email, password });

			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "Ocorreu um erro");
		}
	},
	// Ação para fazer o logout do usuário.
	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null }); // Limpa os dados do usuário do estado.
		} catch (error) {
			toast.error(error.response?.data?.message || "Ocorreu um erro durante o logout");
		}
	},
	// Ação para verificar se o usuário já está autenticado (ex: ao recarregar a página).
	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},
	// Ação para renovar o token de acesso.
	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			// Se a renovação falhar, desloga o usuário.
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},

}));

// Variável para evitar múltiplas chamadas de renovação de token simultaneamente.
let refreshPromise = null;

// Interceptador de respostas do Axios para lidar com a expiração de tokens automaticamente.
axios.interceptors.response.use(
	(response) => response, // Se a resposta for bem-sucedida, apenas a retorna.
	async (error) => {
		const originalRequest = error.config;
		// Verifica se o erro foi de "Não Autorizado" (401) e se a requisição ainda não foi tentada novamente.
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true; // Marca a requisição para evitar loops infinitos.

			try {
				// Se já houver uma promessa de renovação em andamento, aguarda ela terminar.
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest); // Tenta a requisição original novamente.
				}

				// Inicia uma nova promessa de renovação de token.
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null; // Limpa a promessa após a conclusão.

				return axios(originalRequest); // Tenta a requisição original novamente com o novo token.
			} catch (refreshError) {
				// Se a renovação falhar, desloga o usuário e rejeita a promessa.
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
