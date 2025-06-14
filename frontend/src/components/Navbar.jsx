import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Package, User } from "lucide-react";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "Admin";
	const { cart } = useCartStore();

	const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
	const accountMenuRef = useRef(null);

	const categories = [
		{ name: "Filmes", href: "/category/filmes" },
		{ name: "Séries", href: "/category/series" },
		{ name: "Animes", href: "/category/animes" },
		{ name: "Jogos", href: "/category/jogos" },
		{ name: "Músicas", href: "/category/musicas" },
		{ name: "Memes", href: "/category/memes" },
	];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
				setAccountMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className='fixed top-0 left-0 w-full bg-black bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='flex items-center'>
						<span className='text-4xl font-notable font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>
							URPOP
						</span>
					</Link>

					<nav className='flex flex-wrap items-center justify-end gap-x-4 gap-y-2'>

						{!isAdmin && (
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

						<Link
							to={"/my-orders"}
							className='flex items-center text-gray-300 hover:text-white transition duration-300 ease-in-out'
						>
							<Package className='inline-block mr-1' size={20} />
							<span className='hidden sm:inline'>Meus Pedidos</span>
						</Link>

						{user && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-white transition duration-300 ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-white' size={20} />
								<span className='hidden sm:inline'>Carrinho</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}

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

								{/* --- INÍCIO DA NOVA ADIÇÃO: BOTÃO DE CONTA --- */}
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
								{/* --- FIM DA NOVA ADIÇÃO: BOTÃO DE CONTA --- */}
							</>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-gradient-to-r from-[#606cfc] to-[#ff64c4] py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out text-white'
								>
									<UserPlus className='mr-2' size={18} />
									Cadastrar-se
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out'
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