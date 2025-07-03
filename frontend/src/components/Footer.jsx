import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook } from "lucide-react";

// Componente que renderiza o rodapé do site.
const Footer = () => {
    // Array de objetos que define as categorias de produtos e seus links.
    const categories = [
        { name: "Filmes", href: "/category/filmes" },
        { name: "Séries", href: "/category/series" },
        { name: "Animes", href: "/category/animes" },
        { name: "Jogos", href: "/category/jogos" },
        { name: "Músicas", href: "/category/musicas" },
        { name: "Memes", href: "/category/memes" },
    ];

    // Array de objetos que define os links para as redes sociais.
    const socialLinks = [
        { icon: Instagram, href: "https://instagram.com" },
        { icon: Twitter, href: "https://x.com" },
        { icon: Facebook, href: "https://facebook.com" },
    ];

    return (
        <div className="bg-black border-t border-gray-800">
            <div className="h-px bg-gradient-to-r from-transparent via-[#606cfc] to-transparent" />
            <div className="container mx-auto py-2">
                {/* Layout em grid que se adapta: 3 colunas em telas médias e 1 coluna em telas pequenas. */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Coluna 1: Logo e slogan da loja. */}
                    <div className="flex flex-col items-center md:items-start">
                        <Link to='/' className='flex items-center'>
                            <span className='text-4xl font-notable font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>
                                URPOP
                            </span>
                        </Link>
                        <p className="mt-2 text-white text-sm text-center md:text-left">
                            Sua loja de cultura pop, do jeito que te agrada.
                        </p>
                    </div>

                    {/* Coluna 2: Lista de links para as categorias de produtos. */}
                    <div className="text-center py-1">
                        <h3 className="font-bold text-white uppercase mb-4">Categorias de camisetas</h3>
                        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            {categories.map((category) => (
                                <li key={category.name}>
                                    <Link to={category.href} className="font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text hover:text-white transition-colors">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna 3: Links para redes sociais e páginas institucionais. */}
                    <div className="flex flex-col items-center md:items-end">
                        <h3 className="font-bold text-white uppercase mb-3">Siga-nos</h3>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a key={index} href={social.href} className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                                    <social.icon size={24} />
                                </a>
                            ))}
                        </div>
                        <div className="mt-4 text-center md:text-right">
                            <Link to="/about-us" className="text-gray-400 hover:text-white transition-colors text-sm">Sobre Nós</Link>
                            <span className="text-gray-500 mx-2">|</span>
                            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Política de Privacidade</Link>
                            <span className="text-gray-500 mx-2">|</span>
                            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Termos de Serviço</Link>
                        </div>
                    </div>
                </div>

                {/* Seção de direitos autorais. */}
                <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} URPOP. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
