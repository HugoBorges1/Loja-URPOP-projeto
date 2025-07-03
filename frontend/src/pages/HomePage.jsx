import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

// Array de objetos que define as categorias a serem exibidas na página inicial.
const categories = [
    { href: "/filmes", name: "Filmes", imageUrl: "/filmes.png" },
    { href: "/series", name: "Séries", imageUrl: "/series.png" },
    { href: "/animes", name: "Animes", imageUrl: "/animes.png" },
    { href: "/jogos", name: "Jogos", imageUrl: "/jogos.png" },
    { href: "/musicas", name: "Músicas", imageUrl: "/musicas.png" },
    { href: "/memes", name: "Memes", imageUrl: "/memes.png" },
];

// Componente principal da página inicial.
const HomePage = () => {
    // Desestrutura as funções e estados necessários do store de produtos (Zustand).
    const { fetchFeaturedProducts, products, isLoading } = useProductStore();

    // Hook que é executado uma vez quando o componente é montado para buscar os produtos em destaque.
    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]); // O array de dependências garante que a busca seja feita apenas uma vez.

    return (
        <div className='relative min-h-scree overflow-hidden'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 pb-16'>

                <div className="bg-black rounded-b-xl shadow-2xl p-6 sm:p-10 md:p-16">
                    <h1 className='font-notable text-center text-5xl sm:text-5xl bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text mb-4 py-4'>
                        Explore nossas camisetas personalizadas
                    </h1>
                    <p className='text-center text-xl text-gray-300 mb-12 sm:mb-16'>
                        Encontre a camiseta que combina com sua personalidade
                    </p>

                    {/* Grid para exibir os cards das categorias. */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {/* Mapeia o array de categorias para renderizar um componente 'CategoryItem' para cada uma. */}
                        {categories.map((category) => (
                            <CategoryItem category={category} key={category.name} />
                        ))}
                    </div>
                </div>

                {/* Renderização condicional: A seção de produtos em destaque só é exibida se não estiver carregando e se houver produtos. */}
                {!isLoading && products.length > 0 && (
                    <div className="mt-16 sm:mt-24 px-4 sm:px-0">
                        <FeaturedProducts featuredProducts={products} />
                    </div>
                )}
            </div>
        </div>
    );
};
export default HomePage;
