import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
    { href: "/filmes", name: "Filmes", imageUrl: "/filmes.png" },
    { href: "/series", name: "Séries", imageUrl: "/series.png" },
    { href: "/animes", name: "Animes", imageUrl: "/animes.png" },
    { href: "/jogos", name: "Jogos", imageUrl: "/jogos.png" },
    { href: "/musicas", name: "Músicas", imageUrl: "/musicas.png" },
    { href: "/memes", name: "Memes", imageUrl: "/memes.png" },
];

const HomePage = () => {
    const { fetchFeaturedProducts, products, isLoading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

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

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {categories.map((category) => (
                            <CategoryItem category={category} key={category.name} />
                        ))}
                    </div>
                </div>

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