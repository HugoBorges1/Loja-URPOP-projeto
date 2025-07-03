import toast from "react-hot-toast";
import { ShoppingCart, Eye } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

// Componente que exibe um card de produto individual.
const ProductCard = ({ product }) => {
    // Obtém o estado do usuário e a função de adicionar ao carrinho dos respectivos stores.
    const { user } = useUserStore();
    const { addToCart } = useCartStore();

    // Função para lidar com o clique no botão "Adicionar".
    const handleAddToCart = () => {
        // Verifica se o usuário está logado antes de adicionar ao carrinho.
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            return;
        } else {
            // Adiciona o produto ao carrinho com um tamanho padrão 'M' e exibe uma notificação.
            toast.success("Produto adicionado! (Tamanho Padrão M)");
            addToCart(product, "M");
        }
    };

    return (
        <div className='bg-gradient-to-r from-[#ff64c4] to-[#606cfc] flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
            {/* O Link envolve a imagem, tornando-a clicável para navegar para a página de detalhes do produto. */}
            <Link to={`/product/${product._id}`}>
                <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                    <img className='object-cover w-full' src={product.image} alt='product image' />
                </div>
            </Link>

            {/* Contêiner para as informações do produto (nome, preço) e botões de ação. */}
            <div className='mt-4 px-5 pb-5'>
                <h5 className='text-xl font-semibold tracking-tight bg-white text-transparent bg-clip-text'>{product.name}</h5>
                <div className='mt-2 mb-5 flex items-center justify-between'>
                    <p>
                        <span className='text-3xl font-bold bg-white text-transparent bg-clip-text mb-8'>R$ {product.price.toFixed(2)}</span>
                    </p>
                </div>
                {/* Contêiner para os botões de ação. */}
                <div className="flex flex-col gap-2">
                    {/* Botão para adicionar o produto ao carrinho. */}
                    <button
                        className='w-full flex items-center justify-center rounded-lg px-4 py-3 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-violet-300 dark:focus:ring-violet-800 bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-80 transition-all duration-200 whitespace-nowrap'
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={20} className='mr-2 flex-shrink-0' />
                        Adicionar
                    </button>
                    {/* Link que leva para a página de detalhes do produto. */}
                    <Link
                        to={`/product/${product._id}`}
                        className='w-full flex items-center justify-center rounded-lg px-4 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-80 transition-all duration-200 whitespace-nowrap'
                    >
                        <Eye size={20} className='mr-2 flex-shrink-0' />
                        Ver Produto
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
