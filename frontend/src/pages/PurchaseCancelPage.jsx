import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
	return (
		<div className='py-45 flex items-center justify-center px-4'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-black rounded-lg shadow-xl overflow-hidden relative z-10'
			>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<XCircle className='text-red-400 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-red-400 mb-2'>Compra cancelada</h1>
					<p className='text-white text-center mb-6'>
						Seu pedido foi cancelado, nenhuma cobrança será feita. 
						Muito obrigado e perdão o incoveniente.
					</p>
				
					<div className='space-y-4'>
						<Link
							to={"/"}
							className='w-full bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-80 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
						>
							<ArrowLeft className='mr-2' size={18} />
							Voltar a loja
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;
