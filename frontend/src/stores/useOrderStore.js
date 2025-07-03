import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Função auxiliar para extrair uma mensagem de erro mais legível de um objeto de erro.
const getErrorMessage = (error, defaultMessage) => {
    return error.response?.data?.message || error.message || defaultMessage;
};

// Cria um store com Zustand para gerenciar o estado global relacionado aos pedidos.
export const useOrderStore = create((set, get) => ({
    // ---- ESTADOS DO STORE ----
    myOrders: [], // Array para armazenar os pedidos do usuário logado.
    allOrders: [], // Array para armazenar todos os pedidos (visão do admin).
    loading: false, // Flag para indicar se alguma operação está em andamento.

    // ---- AÇÕES DO STORE ----

    // Busca os pedidos do usuário autenticado no backend.
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

    // Busca todos os pedidos do sistema (para o painel de administrador).
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

    // Atualiza o status de um pedido específico (ação de administrador).
    updateOrderStatus: async (orderId, status) => {
        try {
            const res = await axios.patch(`/orders/${orderId}/status`, { status });
            // Atualiza o estado local 'allOrders' para refletir a mudança sem precisar recarregar.
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

    // Deleta um pedido (ação de administrador).
    deleteOrder: async (orderId) => {
        // Pede confirmação ao usuário antes de realizar a ação destrutiva.
        if (!window.confirm("Você tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            await axios.delete(`/orders/${orderId}`);
            // Remove o pedido deletado do estado local 'allOrders'.
            set((state) => ({
                allOrders: state.allOrders.filter((order) => order._id !== orderId),
            }));
            toast.success("Pedido deletado com sucesso!");
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao deletar o pedido."));
        }
    },
    // Permite que o cliente confirme o recebimento do pedido.
    confirmDelivery: async (orderId) => {
        if (!window.confirm("Você confirma o recebimento deste pedido?")) {
            return;
        }
        try {
            const res = await axios.patch(`/orders/${orderId}/confirm-delivery`);
            // Atualiza o estado local 'myOrders' para refletir a mudança na visão do cliente.
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
