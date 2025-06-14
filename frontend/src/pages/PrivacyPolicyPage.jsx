import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center mb-12">
                    <h1 className="text-5xl sm:text-6xl font-notable bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text pb-2">
                        Política de Privacidade
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                        Última atualização: 13 de junho de 2025
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8 text-gray-300 font-sans leading-relaxed"
                >
                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">1. Nosso Compromisso</h2>
                        <p>A URPOP valoriza sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços. Ao usar nosso site, você concorda com a coleta e uso de informações de acordo com esta política.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">2. Informações que Coletamos</h2>
                        <p>Para fornecer e melhorar nosso serviço, coletamos os seguintes tipos de informações:</p>
                        <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
                            <li><strong>Informações Pessoais:</strong> Nome, e-mail, endereço de entrega e informações de contato que você nos fornece ao criar uma conta ou finalizar um pedido.</li>
                            <li><strong>Informações de Pagamento:</strong> Os pagamentos são processados por nosso parceiro seguro, Stripe. Não armazenamos os detalhes completos do seu cartão de crédito em nossos servidores.</li>
                            <li><strong>Dados de Uso:</strong> Coletamos informações sobre como o serviço é acessado e usado (como cliques e páginas visitadas) para nos ajudar a melhorar sua experiência.</li>
                        </ul>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">3. Como Usamos Suas Informações</h2>
                        <p>Utilizamos as informações coletadas para:</p>
                        <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
                            <li>Processar e gerenciar seus pedidos, incluindo envio e entrega.</li>
                            <li>Comunicar com você sobre seu pedido ou responder a suas perguntas.</li>
                            <li>Melhorar e personalizar nosso site e ofertas de produtos.</li>
                            <li>Enviar e-mails de marketing e promoções, caso você opte por recebê-los.</li>
                        </ul>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">4. Compartilhamento e Segurança</h2>
                        <p>Nós não vendemos suas informações pessoais. Compartilhamos seus dados apenas com parceiros essenciais para a operação da nossa loja, como processadores de pagamento e empresas de transporte. Empregamos medidas de segurança padrão do setor para proteger seus dados, mas lembramos que nenhum método de transmissão pela Internet é 100% seguro.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">5. Seus Direitos</h2>
                        <p>Você tem o direito de acessar, atualizar ou solicitar a exclusão de suas informações pessoais a qualquer momento, entrando em contato conosco.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">6. Contato</h2>
                        <p>Para qualquer dúvida sobre esta Política de Privacidade, por favor, entre em contato através dos canais em nosso rodapé.</p>
                    </motion.section>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicyPage;