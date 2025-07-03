import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Componente para exibir um carrossel de produtos em destaque.
const FeaturedProducts = ({ featuredProducts }) => {
	// Estado para controlar o índice do primeiro item visível no carrossel.
	const [currentIndex, setCurrentIndex] = useState(0);
	// Estado para controlar quantos itens são exibidos por vez, para a responsividade.
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const { addToCart } = useCartStore();

	// Função para adicionar um produto ao carrinho.
	const handleAddToCart = (product) => {
		toast.success("Produto adicionado! (Tamanho Padrão M)");
		addToCart(product, "M");
	};

	// Hook para ajustar o número de itens por página com base no tamanho da tela.
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize(); // Executa a função uma vez na montagem.
		window.addEventListener("resize", handleResize); // Adiciona o listener para o evento de redimensionamento.
		// Função de limpeza para remover o listener quando o componente for desmontado.
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Função para avançar o carrossel.
	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	// Função para retroceder o carrossel.
	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	// Verifica se o botão "anterior" deve ser desabilitado.
	const isStartDisabled = currentIndex === 0;
	// Verifica se o botão "próximo" deve ser desabilitado.
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text mb-6'>Em destaque</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						{/* O efeito de carrossel é criado movendo este contêiner horizontalmente com 'transform'. */}
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{/* Mapeia a lista de produtos em destaque para renderizar um card para cada um. */}
							{featuredProducts?.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
									<div className='bg-gradient-to-r from-[#ff64c4] to-[#606cfc] bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-pink-400'>
										<Link to={`/product/${product._id}`}>
											<div className='overflow-hidden'>
												<img
													src={product.image}
													alt={product.name}
													className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
												/>
											</div>
										</Link>
										<div className='p-4'>
											<h3 className='text-lg font-semibold mb-2 text-white'>{product.name}</h3>
											<p className='font-bold text-white bg-clip-text mb-4'>
												R$ {product.price.toFixed(2)}
											</p>
											<button
												onClick={() => handleAddToCart(product)}
												className='w-full bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-120 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center'
											>
												<ShoppingCart className='w-5 h-5 mr-2' />
												Adicionar ao carrinho
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					{/* Botão para navegar para o slide anterior. */}
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 text-white ${isStartDisabled
							? "bg-gray-400 cursor-not-allowed opacity-50"
							: "bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-125"
							}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					{/* Botão para navegar para o próximo slide. */}
					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 text-white ${isEndDisabled
							? "bg-gray-400 cursor-not-allowed opacity-50"
							: "bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-125"
							}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default FeaturedProducts;
