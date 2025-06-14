import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Rocket, Heart } from 'lucide-react';

const AboutUsPage = () => {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl sm:text-6xl font-notable bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text pb-2">
                        Nossa História
                    </h1>
                    <p className="mt-4 text-xl text-gray-300 font-sans">
                        De um fã para todos os fãs.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gray-900/40 p-8 rounded-2xl shadow-2xl mb-16 relative border border-white/10"
                >
                    <div className="absolute -top-5 -left-5 w-16 h-16 bg-gradient-to-r from-[#606cfc] to-[#ff64c4] rounded-full flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white ml-12">O Começo da URPOP</h2>
                    <p className="text-gray-300 leading-relaxed font-sans">
                        A URPOP nasceu da paixão e da frustração de seu fundador, Hugo Borges. Como um apreciador da cultura pop e suas facetas, ele sentia que faltava algo no mercado: camisetas que fossem únicas e criativas quanto as histórias que tanto amava.
                        <br /><br />
                        Cansado de estampas genéricas, Hugo começou em seu próprio quarto com uma pequena prensa térmica, decidido a criar peças que ele mesmo teria orgulho de usar. O que era um hobby virou uma missão quando amigos e comunidades online começaram a pedir seus designs exclusivos. A URPOP cresceu com base em um ideal simples: "Sua loja de cultura pop, do jeito que te agrada".
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid md:grid-cols-2 gap-8 mb-16"
                >
                    <div className="rounded-2xl bg-gradient-to-br from-[#606cfc]/20 to-transparent p-6 border border-white/10">
                        <div className="flex items-center gap-4 mb-4">
                            <Target className="h-8 w-8 text-[#606cfc]" />
                            <h3 className="text-2xl font-bold text-white">Nossa Missão</h3>
                        </div>
                        <p className="text-gray-300 font-sans">
                            Oferecer aos fãs uma forma autêntica com alta qualidade para expressar suas paixões. Criamos mais do que produtos; criamos conexões e estilo.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-[#ff64c4]/20 to-transparent p-6 border border-white/10">
                        <div className="flex items-center gap-4 mb-4">
                            <Rocket className="h-8 w-8 text-[#ff64c4]" />
                            <h3 className="text-2xl font-bold text-white">Nossa Visão</h3>
                        </div>
                        <p className="text-gray-300 font-sans">
                            Ser a principal referência no Brasil em produtos de cultura pop, reconhecida pela criatividade, qualidade e por celebrar a diversidade de gostos que une todos os fãs.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="text-center"
                >
                    <Link
                        to="/"
                        className="inline-block bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-white font-bold rounded-lg px-10 py-4 text-lg hover:scale-105 hover:brightness-125 transition-all duration-300"
                    >
                        Explore Nossos Produtos
                    </Link>
                </motion.div>

            </div>
        </div>
    );
};

export default AboutUsPage;