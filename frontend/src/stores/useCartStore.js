import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const getErrorMessage = (error, defaultMessage) => {
	return error.response?.data?.message || error.message || defaultMessage;
};

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,
    
    shippingAddress: {
        street: "",
        neighborhood: "",
        city: "",
        country: "",
        postalCode: "",
    },

    setShippingAddress: (address) => set((state) => ({
        shippingAddress: { ...state.shippingAddress, ...address }
    })),

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Erro buscando o cupom:", getErrorMessage(error, "O cupom não pode ser encontrado."));
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Cupom aplicado com sucesso");
		} catch (error) {
			toast.error(getErrorMessage(error, "Falha ao aplicar o cupom"));
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Cupom removido");
	},
	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			console.error("Falha ao buscar itens do carrinho:", getErrorMessage(error));
			set({ cart: [] });
		}
	},
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product, size) => {
		try {
			await axios.post("/cart", { productId: product._id, size: size });
			toast.success("Produto adicionado ao carrinho");

			const state = get();
			const existingItem = state.cart.find(
				(item) => item._id === product._id && item.size === size
			);

			let newCart;
			if (existingItem) {
				newCart = state.cart.map((item) =>
					item._id === product._id && item.size === size
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			} else {
				newCart = [...state.cart, { ...product, quantity: 1, size: size }];
			}
			set({ cart: newCart });
			get().calculateTotals();
		} catch (error) {
			toast.error(getErrorMessage(error, "Um erro ocorreu ao adicionar o item ao carrinho"));
		}
	},
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
	updateQuantity: async (productId, quantity, size) => {
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
	calculateTotals: () => {
		const { cart, coupon, isCouponApplied } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon && isCouponApplied) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));