import { BarChart, PlusCircle, ShoppingBasket, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Importa os componentes que serão renderizados em cada aba.
import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AdminOrdersTab from "../components/AdminOrdersTab"
import { useProductStore } from "../stores/useProductStore";

// Array de objetos que define as abas de navegação do painel de administrador.
const tabs = [
    { id: "create", label: "Criar produto", icon: PlusCircle },
    { id: "products", label: "Produtos", icon: ShoppingBasket },
    { id: "analytics", label: "Estatísticas", icon: BarChart },
    { id: "orders", label: "Pedidos", icon: ClipboardList },
];

// Componente principal da página de administração.
const AdminPage = () => {
    // Estado para controlar qual aba está ativa no momento. O valor inicial é "create".
    const [activeTab, setActiveTab] = useState("create");
    const { fetchAllProducts } = useProductStore();

    // Hook que busca todos os produtos quando o componente é montado.
    // Isso é útil para a aba "Produtos", que já terá os dados pré-carregados.
    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    return (
        <div className='min-h-screen relative overflow-hidden'>
            <div className='relative z-10 container mx-auto px-4 py-16'>
                <motion.h1
                    className='text-4xl font-bold mb-8 bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text text-center'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Painel de administrador
                </motion.h1>

                {/* Contêiner para os botões de navegação das abas. */}
                <div className='flex justify-center mb-8'>
                    {/* Mapeia o array de abas para renderizar os botões de navegação. */}
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            // A classe do botão muda dinamicamente para destacar a aba ativa.
                            className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${activeTab === tab.id
                                ? "bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-white"
                                : "bg-gradient-to-r from-[#606cfc] to-[#ff64c4] brightness-50"
                                }`}
                        >
                            <tab.icon className='mr-2 h-5 w-5' />
                            {tab.label}
                        </button>
                    ))}
                </div>
                {/* Renderização condicional do conteúdo da aba com base no estado 'activeTab'. */}
                {activeTab === "create" && <CreateProductForm />}
                {activeTab === "products" && <ProductsList />}
                {activeTab === "analytics" && <AnalyticsTab />}
                {activeTab === "orders" && <AdminOrdersTab />}
            </div>
        </div>
    );
};
export default AdminPage;
