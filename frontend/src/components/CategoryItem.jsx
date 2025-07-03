import { Link } from "react-router-dom";

// Componente que exibe um card de categoria clicável na página inicial.
const CategoryItem = ({ category }) => {
    return (
        // O contêiner principal do card, com efeito de 'group' para o hover.
        <div className='relative overflow-hidden h-96 w-full rounded-lg group'>
            {/* O componente 'Link' do React Router envolve todo o card, tornando-o um link navegável. */}
            <Link to={"/category" + category.href}>
                <div className='w-full h-full cursor-pointer'>
                    {/* Div para o overlay de gradiente, que escurece a parte inferior da imagem para dar contraste ao texto. */}
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />
                    {/* Imagem de fundo da categoria. */}
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        // O 'group-hover:scale-110' cria um efeito de zoom na imagem quando o mouse passa sobre o 'group'.
                        className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
                        loading='lazy' // Otimização para carregar a imagem apenas quando ela estiver próxima da tela.
                    />
                    {/* Contêiner para o texto que fica sobre a imagem. */}
                    <div className='absolute bottom-0 left-0 right-0 p-4 z-20'>
                        <h3 className='text-white text-2xl font-bold mb-2'>{category.name}</h3>
                        <p className='text-gray-200 text-sm'>Camisetas de {category.name}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CategoryItem;
