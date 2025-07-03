import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

// Componente que exibe todos os produtos de uma categoria específica.
const CategoryPage = () => {
    // Desestrutura as funções e estados necessários do store de produtos (Zustand).
    const { fetchProductsByCategory, products, loading } = useProductStore();
    // Obtém o parâmetro 'category' da URL (ex: /category/filmes -> category = "filmes").
    const { category } = useParams();

    // Hook que é executado sempre que a categoria na URL muda.
    useEffect(() => {
        // Chama a função para buscar os produtos da categoria especificada.
        fetchProductsByCategory(category);
    }, [fetchProductsByCategory, category]); // O array de dependências garante que a busca seja refeita se a categoria mudar.

    // Se os dados ainda estiverem carregando, exibe um spinner.
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-15'>
                <div className="rounded-b-xl bg-gradient-to-r from-[#606cfc] to-[#ff64c4] p-px shadow-2xl">
                    <div className="bg-[#000000] rounded-b-xl p-6 sm:p-10 md:p-16">
                        {/* Título da página, que exibe o nome da categoria com a primeira letra maiúscula. */}
                        <motion.h1
                            className='text-center text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text mb-8 pb-2'
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Camisetas personalizadas de {category.charAt(0).toUpperCase() + category.slice(1)}
                        </motion.h1>

                        {/* Grid para exibir os cards de produtos. */}
                        <motion.div
                            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 justify-items-center'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Renderização condicional: se não houver produtos, exibe uma mensagem. */}
                            {products?.length === 0 && !loading && (
                                <h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
                                    Não há produtos nessa categoria
                                </h2>
                            )}

                            {/* Mapeia a lista de produtos para renderizar um 'ProductCard' para cada um. */}
                            {products?.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CategoryPage;
