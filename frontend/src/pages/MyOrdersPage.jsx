import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useOrderStore } from "../stores/useOrderStore";
import OrderCard from "../components/OrderCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Package } from "lucide-react";

// Componente que renderiza a página "Meus Pedidos", listando todos os pedidos do usuário logado.
const MyOrdersPage = () => {
    // Desestrutura os estados e funções necessários do store de pedidos (Zustand).
    const { myOrders, fetchMyOrders, loading } = useOrderStore();
    // O hook 'useLocation' é usado para acessar informações da URL atual.
    const location = useLocation();

    // Hook que é executado uma vez quando o componente é montado para buscar os pedidos do usuário.
    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders]); // O array de dependências com a função garante que a busca seja estável.

    // Extrai o ID do pedido da "hash" da URL (ex: /my-orders#someOrderId) para destacar um pedido específico.
    const highlightedOrderId = location.hash.substring(1);

    // Se os dados ainda estiverem carregando, exibe um spinner.
    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl shadow-2xl p-6 sm:p-8 mb-8">
                <h1 className="text-center text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text pb-2">
                    Meus Pedidos
                </h1>
            </div>

            <div className="space-y-6">
                {/* Renderização condicional: verifica se o usuário tem algum pedido. */}
                {myOrders.length === 0 ? (
                    // Se não houver pedidos, exibe uma mensagem incentivando o usuário a comprar.
                    <div className="text-center py-20 px-6 flex flex-col items-center justify-center bg-black/100 rounded-xl min-h-[400px]">
                        <Package size={64} className="text-white mb-4" />
                        <h2 className="text-2xl font-semibold text-white mb-2">
                            Você ainda não fez nenhum pedido.
                        </h2>
                        <p className="text-white max-w-md">
                            Que tal explorar nossas camisetas? Temos certeza de que você encontrará algo que é a sua cara.
                        </p>
                        <Link
                            to="/"
                            className="mt-6 bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-white font-bold rounded-lg px-8 py-3 hover:brightness-125 transition-all"
                        >
                            Explorar Produtos
                        </Link>
                    </div>
                ) : (
                    // Se houver pedidos, mapeia a lista para renderizar um 'OrderCard' para cada um.
                    myOrders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            // A prop 'isInitiallyOpen' faz com que o card do pedido destacado já venha aberto.
                            isInitiallyOpen={order._id === highlightedOrderId}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
