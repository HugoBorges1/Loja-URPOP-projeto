import axios from "axios";

// Cria uma instância personalizada do Axios para ser usada em toda a aplicação.
// Isso permite definir configurações padrão para todas as requisições HTTP.
const axiosInstance = axios.create({
	// Define a URL base para as requisições da API.
	// Em ambiente de desenvolvimento, aponta para o servidor local. Em produção, aponta para o caminho relativo '/api'.
	baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
	// Permite que o navegador envie cookies (como os de autenticação) junto com as requisições para o backend.
	withCredentials: true,
});

// Exporta a instância configurada para ser importada em outros arquivos.
export default axiosInstance;
