import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

// Cria um store com Zustand para gerenciar o estado global relacionado aos produtos.
export const useProductStore = create((set) => ({
	// ---- ESTADOS DO STORE ----
	products: [], // Array para armazenar a lista de produtos.
	selectedProduct: null, // Armazena os dados do produto atualmente selecionado.
	loading: false, // Flag para indicar se alguma operação de busca ou alteração está em andamento.

	// ---- AÇÕES DO STORE ----

	// Ação para definir manualmente a lista de produtos (pode ser usada em testes ou casos específicos).
	setProducts: (products) => set({ products }),

	// Busca um único produto pelo seu ID no backend.
	fetchProductById: async (productId) => {
		set({ loading: true, selectedProduct: null });
		try {
			const response = await axios.get(`/products/${productId}`);
			set({ selectedProduct: response.data, loading: false });
		} catch (error) {
			set({ error: "Falha na busca do produto", loading: false });
			toast.error(error.response?.data?.message || "Falha na busca do produto");
		}
	},
	// Cria um novo produto no backend.
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			// Adiciona o novo produto à lista de produtos no estado local para atualizar a UI.
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	// Busca todos os produtos do backend (geralmente para o painel de admin).
	fetchAllProducts: async () => {
		set({ products: [], loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Falha ao buscar produtos", loading: false });
			toast.error(error.response.data.error || "Falha ao buscar produtos");
		}
	},
	// Busca produtos por uma categoria específica.
	fetchProductsByCategory: async (category) => {
		set({ products: [], loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Falha ao buscar produtos", loading: false });
			toast.error(error.response.data.error || "Falha ao buscar produtos");
		}
	},
	// Deleta um produto (ação de administrador).
	deleteProduct: async (productId) => {

		if (!window.confirm("Você tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.")) {
			return;
		}

		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			// Remove o produto deletado do estado local para atualizar a UI instantaneamente.
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Falha ao deletar produto");
		}
	},
	// Alterna o status de "destaque" de um produto.
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// Atualiza o estado do produto específico na lista para refletir a mudança.
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Falha ao atualizar o produto");
		}
	},
	// Busca os produtos marcados como "destaque".
	fetchFeaturedProducts: async () => {
		set({ products: [], loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Falha ao buscar produtos", loading: false });
			console.log("Erro buscando produtos em destaque:", error);
		}
	},
}));
