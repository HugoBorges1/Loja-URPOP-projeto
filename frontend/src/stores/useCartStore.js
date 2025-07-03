import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Função auxiliar para extrair uma mensagem de erro mais legível de um objeto de erro.
const getErrorMessage = (error, defaultMessage) => {
	return error.response?.data?.message || error.message || defaultMessage;
};

// Cria um store com Zustand para gerenciar o estado global do carrinho de compras.
export const useCartStore = create((set, get) => ({
	// ---- ESTADOS DO STORE ----
	cart: [], // Array para armazenar os itens do carrinho.
	coupon: null, // Armazena os dados do cupom, se houver.
	total: 0, // O valor total da compra (com descontos).
	subtotal: 0, // O valor total dos itens antes dos descontos.
	isCouponApplied: false, // Flag para indicar se um cupom está ativo.

	// Estado para o endereço de entrega.
	shippingAddress: {
		street: "",
		neighborhood: "",
		city: "",
		country: "",
		postalCode: "",
	},

	// ---- AÇÕES DO STORE ----

	// Ação para atualizar o endereço de entrega no estado.
	setShippingAddress: (address) => set((state) => ({
		shippingAddress: { ...state.shippingAddress, ...address }
	})),

	// Busca o cupom do usuário no backend.
	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Erro buscando o cupom:", getErrorMessage(error, "O cupom não pode ser encontrado."));
		}
	},
	// Valida e aplica um cupom ao carrinho.
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals(); // Recalcula os totais após aplicar o cupom.
			toast.success("Cupom aplicado com sucesso");
		} catch (error) {
			toast.error(getErrorMessage(error, "Falha ao aplicar o cupom"));
		}
	},
	// Remove o cupom aplicado.
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals(); // Recalcula os totais.
		toast.success("Cupom removido");
	},
	// Busca os itens do carrinho do usuário no backend.
	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals(); // Calcula os totais com base nos itens recebidos.
		} catch (error) {
			console.error("Falha ao buscar itens do carrinho:", getErrorMessage(error));
			set({ cart: [] });
		}
	},
	// Limpa o estado do carrinho (usado após uma compra bem-sucedida).
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	// Adiciona um item ao carrinho.
	addToCart: async (product, size) => {
		try {
			// Primeiro, envia a requisição para o backend para persistir a alteração.
			await axios.post("/cart", { productId: product._id, size: size });
			toast.success("Produto adicionado ao carrinho");

			// Em seguida, atualiza o estado local (otimização de UI).
			const state = get();
			const existingItem = state.cart.find(
				(item) => item._id === product._id && item.size === size
			);

			let newCart;
			if (existingItem) {
				// Se o item já existe, apenas incrementa a quantidade.
				newCart = state.cart.map((item) =>
					item._id === product._id && item.size === size
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			} else {
				// Se não existe, adiciona o novo item ao array do carrinho.
				newCart = [...state.cart, { ...product, quantity: 1, size: size }];
			}
			set({ cart: newCart });
			get().calculateTotals(); // Recalcula os totais.
		} catch (error) {
			toast.error(getErrorMessage(error, "Um erro ocorreu ao adicionar o item ao carrinho"));
		}
	},
	// Remove um item completamente do carrinho.
	removeFromCart: async (productId, size) => {
		try {
			await axios.delete(`/cart`, { data: { productId, size } });
			set((prevState) => ({
				cart: prevState.cart.filter((item) => !(item._id === productId && item.size === size)),
			}));
			get().calculateTotals();
			toast.success("Item removido do carrinho");
		} catch (error) {
			toast.error(getErrorMessage(error, "Falha ao remover o item"));
		}
	},
	// Atualiza a quantidade de um item no carrinho.
	updateQuantity: async (productId, quantity, size) => {
		// Se a quantidade for 0 ou menor, remove o item do carrinho.
		if (quantity <= 0) {
			return get().removeFromCart(productId, size);
		}

		try {
			await axios.put(`/cart/${productId}`, { quantity, size });
			set((prevState) => ({
				cart: prevState.cart.map((item) =>
					item._id === productId && item.size === size ? { ...item, quantity } : item
				),
			}));
			get().calculateTotals();
		} catch (error) {
			toast.error(getErrorMessage(error, "A atualização da quantidade falhou"));
		}
	},
	// Calcula o subtotal e o total da compra.
	calculateTotals: () => {
		const { cart, coupon, isCouponApplied } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		// Se um cupom estiver aplicado, calcula o desconto e o subtrai do total.
		if (coupon && isCouponApplied) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));
