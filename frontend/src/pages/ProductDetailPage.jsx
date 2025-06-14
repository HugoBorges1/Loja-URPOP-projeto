import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronRight, Truck, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useUserStore();
    const { addToCart } = useCartStore();
    const [selectedSize, setSelectedSize] = useState(null);
    const [cep, setCep] = useState("");
    const [shippingCost, setShippingCost] = useState(null);
    const fetchProductById = useProductStore((state) => state.fetchProductById);
    const product = useProductStore((state) => state.selectedProduct);
    const loading = useProductStore((state) => state.loading);

    useEffect(() => {
        fetchProductById(id);
    }, [id]);

    useEffect(() => {
        if (product?.sizes?.length > 0 && !selectedSize) {
            setSelectedSize(product.sizes[0]);
        }
    }, [product, selectedSize]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Faça login para adicionar itens ao carrinho.");
            return;
        }
        if (!selectedSize) {
            toast.error("Por favor, selecione um tamanho.");
            return;
        }
        addToCart(product, selectedSize);
    };

    const handleCepSubmit = (e) => {
        e.preventDefault();
        if (cep.replace(/\D/g, '').length === 8) {
            const calculatedCost = 20.00;
            setShippingCost(calculatedCost);
            toast.success(`Frete calculado!`);
        } else {
            toast.error("Por favor, insira um CEP válido.");
            setShippingCost(null);
        }
    };

    const handleCepChange = (e) => {
        setCep(e.target.value);
        if (shippingCost !== null) {
            setShippingCost(null);
        }
    };

    if (loading || !product) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-white font-semibold text-lg rounded-lg mb-8 inline-flex items-center gap-2 group px-4 py-2 transition-all duration-300 hover:brightness-110"
                >
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Voltar
                </button>

                <div className="rounded-lg p-px bg-gradient-to-r from-[#606cfc] to-[#ff64c4] shadow-2xl">
                    <div className="bg-black rounded-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-16 md:items-center">
                        <motion.div
                            className="w-full max-h-[600px] overflow-hidden rounded-lg"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </motion.div>

                        <motion.div
                            className="flex flex-col justify-center"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text mb-4 py-2">
                                {product.name}
                            </h1>

                            <p className="text-gray-300 mb-6 whitespace-pre-wrap">{product.description}</p>

                            <p className="text-5xl font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text mb-8">
                                R$ {product.price.toFixed(2)}
                            </p>

                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-white mb-2">Tamanho:</h3>
                                <div className="flex gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 rounded-lg transition-all duration-200 font-bold text-white bg-gradient-to-r from-[#606cfc] to-[#ff64c4]
                                            ${selectedSize === size
                                                    ? 'opacity-100 ring-2 ring-offset-2 ring-offset-black ring-white'
                                                    : 'opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className='mt-0 w-full flex items-center justify-center rounded-lg px-12 py-2 text-center text-lg font-medium text-white focus:outline-none focus:ring-4 bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-125 transition-all duration-300'
                            >
                                <ShoppingCart className="mr-3" />
                                Adicionar ao carrinho
                            </button>

                            <form onSubmit={handleCepSubmit} className="flex gap-2 mb-2 pt-4">
                                <div className="relative flex-grow">
                                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                                    <input
                                        type="text"
                                        value={cep}
                                        onChange={handleCepChange}
                                        placeholder="Digite seu CEP"
                                        className="w-full pl-10 pr-4 py-2 bg-black border border-gray-600 rounded-md placeholder-white text-white focus:outline-none focus:ring-1 focus:ring-pink-400"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 rounded-md bg-black hover:bg-pink-400 border border-gray-600 text-white font-semibold transition-colors">
                                    Calcular
                                </button>
                            </form>

                            {shippingCost !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-left mb-8"
                                >
                                    <p className="text-md text-white">
                                        Frete: <span className="font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text"> R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                                    </p>
                                </motion.div>
                            )}

                            <Link
                                to="/cart"
                                className="flex items-center justify-center gap-1 font-semibold group"
                            >
                                <span className="bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text group-hover:brightness-125 transition-all">
                                    Ir para o carrinho e finalizar pedido
                                </span>
                                <ChevronRight
                                    size={20}
                                    className="text-[#ff64c4] transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetailPage;