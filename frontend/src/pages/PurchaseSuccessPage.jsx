import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import LoadingSpinner from "../components/LoadingSpinner";

// Componente que renderiza a página de sucesso após uma compra bem-sucedida.
const PurchaseSuccessPage = () => {
    // Estados para controlar os detalhes do pedido, o processamento e erros.
    const [orderDetails, setOrderDetails] = useState({ id: null, number: null });
    const [isProcessing, setIsProcessing] = useState(true);
    const { clearCart } = useCartStore();
    const [error, setError] = useState(null);

    // Hook que é executado após a montagem para processar o sucesso do checkout.
    useEffect(() => {
        // Função assíncrona para comunicar com o backend e confirmar o sucesso do pagamento.
        const handleCheckoutSuccess = async (sessionId) => {
            try {
                // Envia o ID da sessão para o backend para verificação e criação do pedido.
                const res = await axios.post("/payments/checkout-success", { sessionId });
                // Atualiza o estado com os detalhes do pedido e limpa o carrinho do usuário.
                setOrderDetails({ id: res.data.orderId, number: res.data.orderNumber });
                clearCart();
            } catch (error) {
                setError(error.message || "Ocorreu um erro ao processar seu pedido.");
            } finally {
                // Garante que o estado de processamento seja desativado, mesmo se ocorrer um erro.
                setIsProcessing(false);
            }
        };

        // Extrai o 'session_id' dos parâmetros da URL, que foi adicionado pelo Stripe no redirecionamento.
        const sessionId = new URLSearchParams(window.location.search).get("session_id");
        if (sessionId) {
            handleCheckoutSuccess(sessionId);
        } else {
            setIsProcessing(false);
            setError("ID da sessão de pagamento não encontrado.");
        }
    }, [clearCart]);

    // Renderização condicional com base no estado de processamento e erro.
    if (isProcessing) return <LoadingSpinner />;
    if (error) return `Erro: ${error}`;

    return (
        <div className='py-35 flex items-center justify-center px-4'>
            {/* Componente de terceiros para exibir um efeito de confete na tela. */}
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                gravity={0.1}
                style={{ zIndex: 99 }}
                numberOfPieces={700}
                recycle={false}
            />

            <div className='rounded-lg bg-gradient-to-r from-[#606cfc] to-[#ff64c4] p-px'>
                <div className='max-w-md w-full bg-black rounded-lg shadow-xl overflow-hidden relative z-10'>
                    <div className='p-6 sm:p-8'>
                        <div className='flex justify-center'>
                            <CheckCircle className='text-pink-400 w-16 h-16 mb-4' />
                        </div>
                        <h1 className='text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text mb-2'>
                            Compra feita com sucesso!
                        </h1>

                        <p className='text-gray-300 text-center mb-2'>
                            Obrigado pelo seu pedido. Estamos processando ele.
                        </p>
                        <p className='bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text text-center text-sm mb-6'>
                            Cheque "Meus Pedidos" para acompanhar os detalhes do seu pedido.
                        </p>
                        {/* Exibe os detalhes do pedido, como o número e o tempo de entrega estimado. */}
                        <div className='bg-black rounded-lg p-4 mb-6'>
                            <div className='flex items-center justify-between mb-2'>
                                <span className='text-sm text-white'>Número do pedido</span>
                                {/* Link para a página "Meus Pedidos", incluindo o ID do novo pedido na URL para destaque. */}
                                <Link
                                    to={`/my-orders#${orderDetails.id}`}
                                    className='text-sm font-semibold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text hover:underline'
                                >
                                    #{orderDetails.number}
                                </Link>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-white'>Tempo estimado de entrega</span>
                                <span className='text-sm font-semibold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>3 a 5 dias úteis</span>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <button
                                className='w-full bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-120 text-white font-bold py-2 px-4
                 rounded-lg transition duration-300 flex items-center justify-center'
                            >
                                <HandHeart className='mr-2' size={18} />
                                Obrigado pela preferência!
                            </button>
                            <Link
                                to={"/"}
                                className='w-full bg-black rounded-lg transition duration-300 flex items-center justify-center py-2 px-4 group'
                            >
                                <span className="font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text">
                                    Continue comprando
                                </span>

                                <ArrowRight className='ml-2 text-[#ff64c4] transition-transform group-hover:translate-x-1' size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default PurchaseSuccessPage;
