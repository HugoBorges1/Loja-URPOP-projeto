import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	selectedProduct: null,
	loading: false,

	setProducts: (products) => set({ products }),

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
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
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
	deleteProduct: async (productId) => {

		if (!window.confirm("Você tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.")) {
			return;
		}

		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Falha ao deletar produto");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
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