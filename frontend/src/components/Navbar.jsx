import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Package, User } from "lucide-react";

// Componente da barra de navegação principal do site.
const Navbar = () => {
	// Obtém o estado do usuário e a função de logout do store.
	const { user, logout } = useUserStore();
	// Verifica se o usuário tem o papel de "Admin".
	const isAdmin = user?.role === "Admin";
	// Obtém o estado do carrinho para exibir o número de itens.
	const { cart } = useCartStore();

	// Estado para controlar a visibilidade do menu suspenso da conta.
	const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
	// Referência para o elemento do menu, para detectar cliques fora dele.
	const accountMenuRef = useRef(null);

	const categories = [
		{ name: "Filmes", href: "/category/filmes" },
		{ name: "Séries", href: "/category/series" },
		{ name: "Animes", href: "/category/animes" },
		{ name: "Jogos", href: "/category/jogos" },
		{ name: "Músicas", href: "/category/musicas" },
		{ name: "Memes", href: "/category/memes" },
	];

	// Hook para fechar o menu da conta quando o usuário clica fora dele.
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
				setAccountMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		// Função de limpeza para remover o listener quando o componente for desmontado.
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className='fixed top-0 left-0 w-full bg-black bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					{/* Link do logo que leva para a página inicial. */}
					<Link to='/' className='flex items-center'>
						<span className='text-4xl font-notable font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>
							URPOP
						</span>
					</Link>

					<nav className='flex flex-wrap items-center justify-end gap-x-4 gap-y-2'>

						{/* Renderização condicional: Exibe as categorias se o usuário NÃO for um administrador ou se não houver usuário logado. */}
						{user && !isAdmin && (
							<div className="text-center font-notable">
								<ul className="flex flex-wrap justify-center gap-x-8 px-15">
									{categories.map((category) => (
										<li key={category.name}>
											<Link to={category.href} className="font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text hover:text-white transition-colors">
												{category.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}

						{!user && (
							<div className="text-center font-notable">
								<ul className="flex flex-wrap justify-center gap-x-8 px-40">
									{categories.map((category) => (
										<li key={category.name}>
											<Link to={category.href} className="font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text hover:text-white transition-colors">
												{category.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Link para a página "Meus Pedidos". */}
						{user && (

							<Link
								to={"/my-orders"}
								className='flex items-center text-gray-300 hover:text-white transition duration-300 ease-in-out'
							>
								<Package className='inline-block mr-1' size={20} />
								<span className='hidden sm:inline'>Meus Pedidos</span>
							</Link>

						)}

						{/* Renderização condicional: O link do carrinho só aparece se o usuário estiver logado. */}
						{user && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-white transition duration-300 ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-white' size={20} />
								<span className='hidden sm:inline'>Carrinho</span>
								{/* Exibe um contador com o número de itens no carrinho. */}
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}

						{/* Renderização condicional: O link para o painel de admin só aparece se o usuário for admin. */}
						{isAdmin && (
							<Link
								className='bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-125 text-white px-4 py-2 rounded-md font-medium
                                 transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Painel de administrador</span>
							</Link>
						)}

						{/* Renderização condicional: Exibe "Sair" e menu da conta se o usuário estiver logado, ou "Cadastrar" e "Entrar" caso contrário. */}
						{user ? (
							<>
								<button
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out'
									onClick={logout}
								>
									<LogOut size={18} />
									<span className='hidden sm:inline ml-2'>Sair</span>
								</button>

								{/* Menu suspenso da conta do usuário. */}
								<div className="relative" ref={accountMenuRef}>
									<button onClick={() => setAccountMenuOpen(!isAccountMenuOpen)} className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
										<User size={20} />
									</button>
									{isAccountMenuOpen && (
										<div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-md shadow-lg p-4">
											<p className="text-sm text-gray-400">Logado como:</p>
											<p className="text-md text-white truncate font-medium">{user.email}</p>
										</div>
									)}
								</div>
							</>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-gradient-to-r from-[#606cfc] to-[#ff64c4] py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out text-white'
								>
									<UserPlus className='mr-2' size={18} />
									Cadastrar-se
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Entrar
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
			<div className="h-px bg-gradient-to-r from-transparent via-[#606cfc] to-transparent" />
		</header>
	);
};
export default Navbar;
