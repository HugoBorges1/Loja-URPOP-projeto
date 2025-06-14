import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
    const { fetchProductsByCategory, products, loading } = useProductStore();
    const { category } = useParams();

    useEffect(() => {
        fetchProductsByCategory(category);
    }, [fetchProductsByCategory, category]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-15'>
                <div className="rounded-b-xl bg-gradient-to-r from-[#606cfc] to-[#ff64c4] p-px shadow-2xl">
                    <div className="bg-[#000000] rounded-b-xl p-6 sm:p-10 md:p-16">
                        {/* --- FIM DA ALTERAÇÃO --- */}
                        <motion.h1
                            className='text-center text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text mb-8 pb-2'
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Camisetas personalizadas de {category.charAt(0).toUpperCase() + category.slice(1)}
                        </motion.h1>

                        <motion.div
                            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 justify-items-center'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {products?.length === 0 && !loading && (
                                <h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
                                    Não há produtos nessa categoria
                                </h2>
                            )}

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