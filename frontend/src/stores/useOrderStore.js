import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const getErrorMessage = (error, defaultMessage) => {
    return error.response?.data?.message || error.message || defaultMessage;
};

export const useOrderStore = create((set, get) => ({
    myOrders: [],
    allOrders: [],
    loading: false,

    fetchMyOrders: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/orders/my-orders");
            set({ myOrders: res.data, loading: false });
        } catch (error) {
            console.error(getErrorMessage(error, "Falha em buscar os pedidos"));
            set({ loading: false });
        }
    },

    fetchAllOrders: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/orders/all");
            set({ allOrders: res.data, loading: false });
        } catch (error) {
            console.error(getErrorMessage(error, "Falha em buscar todos os pedidos"));
            set({ loading: false });
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            const res = await axios.patch(`/orders/${orderId}/status`, { status });
            set((state) => ({
                allOrders: state.allOrders.map((order) =>
                    order._id === orderId ? { ...order, status: res.data.status } : order
                ),
            }));
            toast.success("Status do pedido atualizado!");
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao atualizar o status do pedido"));
        }
    },

    deleteOrder: async (orderId) => {
        if (!window.confirm("Você tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            await axios.delete(`/orders/${orderId}`);
            set((state) => ({
                allOrders: state.allOrders.filter((order) => order._id !== orderId),
            }));
            toast.success("Pedido deletado com sucesso!");
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao deletar o pedido."));
        }
    },
    confirmDelivery: async (orderId) => {
        if (!window.confirm("Você confirma o recebimento deste pedido?")) {
            return;
        }
        try {
            const res = await axios.patch(`/orders/${orderId}/confirm-delivery`);
            // Atualiza o estado local para o cliente
            set((state) => ({
                myOrders: state.myOrders.map((order) =>
                    order._id === orderId ? { ...order, status: res.data.status } : order
                ),
            }));
            toast.success("Entrega confirmada! Obrigado!");
        } catch (error) {
            toast.error(getErrorMessage(error, "Não foi possível confirmar a entrega."));
        }
    },
}));