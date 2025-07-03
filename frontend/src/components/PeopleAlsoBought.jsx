import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

// Componente para exibir uma seção de produtos recomendados ("Pessoas também compram").
const PeopleAlsoBought = () => {
	// Estado para armazenar a lista de produtos recomendados.
	const [recommendations, setRecommendations] = useState([]);
	// Estado para controlar a exibição do spinner de carregamento.
	const [isLoading, setIsLoading] = useState(true);

	// Hook que é executado uma vez quando o componente é montado para buscar as recomendações.
	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				// Faz uma requisição GET para a rota de recomendações do backend.
				const res = await axios.get("/products/recommendations");
				// Atualiza o estado com os dados recebidos.
				setRecommendations(res.data);
			} catch (error) {
				toast.error(error.response.data.message || "An error occurred while fetching recommendations");
			} finally {
				// Garante que o estado de carregamento seja desativado, mesmo se ocorrer um erro.
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []); // O array de dependências vazio garante que o hook seja executado apenas uma vez.

	// Se os dados ainda estiverem carregando, exibe o componente de spinner.
	if (isLoading) return <LoadingSpinner />;

	return (
		<div className='mt-8'>
			<h3 className='text-2xl font-semibold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>Pessoas também compram</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{/* Mapeia a lista de recomendações para renderizar um 'ProductCard' para cada produto. */}
				{recommendations.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};
export default PeopleAlsoBought;
