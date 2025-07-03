import { motion } from 'framer-motion';

// Componente que renderiza a página estática de "Termos de Uso".
const TermsOfServicePage = () => {
    // Define as variantes de animação para o contêiner principal das seções de texto.
    const containerVariants = {
        hidden: { opacity: 0 }, // Estado inicial: invisível.
        visible: {
            opacity: 1, // Estado final: visível.
            transition: {
                // 'staggerChildren' cria um efeito de cascata, animando os filhos (as seções) um após o outro com um pequeno atraso.
                staggerChildren: 0.1,
            },
        },
    };

    // Define as variantes de animação para cada item (seção) individualmente.
    const itemVariants = {
        hidden: { opacity: 0, y: 20 }, // Estado inicial: invisível e ligeiramente deslocado para baixo.
        visible: { opacity: 1, y: 0 },   // Estado final: visível e na sua posição original.
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
                        Termos de Uso
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                        Última atualização: 13 de junho de 2025
                    </p>
                </div>

                {/* Este contêiner 'motion.div' orquestra a animação em cascata de seus filhos. */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8 text-gray-300 font-sans leading-relaxed"
                >
                    {/* Cada 'motion.section' é um item filho que será animado individualmente. */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">1. Bem-vindo à URPOP!</h2>
                        <p>Ao acessar e usar o site da URPOP (urpop.com.br), você concorda em cumprir e aceitar estes Termos de Uso. Estes termos aplicam-se a todos os visitantes e usuários. Se você não concordar com qualquer parte dos termos, não poderá acessar o serviço.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">2. Contas de Usuário</h2>
                        <p>Ao criar uma conta conosco, você deve nos fornecer informações precisas, completas e atuais. A falha em fazer isso constitui uma violação dos Termos, o que pode resultar na rescisão imediata da sua conta em nosso serviço. Você é responsável por proteger a senha que usa para acessar o serviço e por quaisquer atividades ou ações sob sua senha.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">3. Pedidos e Pagamentos</h2>
                        <p>Reservamo-nos o direito de recusar ou cancelar seu pedido a qualquer momento por certas razões, incluindo, mas não se limitando a: disponibilidade do produto, erros na descrição ou preço do produto, ou erro em seu pedido. Todos os pagamentos são processados através de um gateway seguro. Os preços dos nossos produtos estão sujeitos a alterações sem aviso prévio.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">4. Propriedade Intelectual</h2>
                        <p>O serviço e seu conteúdo original, características e funcionalidades são e continuarão sendo propriedade exclusiva da URPOP e seus licenciadores. Nossos designs são criados com paixão e protegidos por direitos autorais. A reprodução ou redistribuição não autorizada de nossos designs é estritamente proibida.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">5. Links Para Outros Sites</h2>
                        <p>Nosso serviço pode conter links para sites de terceiros ou serviços que não são de propriedade ou controlados pela URPOP. Não temos controle e não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">6. Alterações nos Termos</h2>
                        <p>Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Avisaremos sobre quaisquer alterações, publicando os novos Termos de Uso neste site.</p>
                    </motion.section>

                    <motion.section variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-white mb-3">7. Contato</h2>
                        <p>Se você tiver alguma dúvida sobre estes Termos, por favor, entre em contato conosco através dos canais disponíveis em nosso rodapé.</p>
                    </motion.section>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default TermsOfServicePage;
