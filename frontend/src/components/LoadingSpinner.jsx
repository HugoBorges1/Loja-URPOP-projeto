// Componente simples para exibir uma animação de carregamento (spinner).
const LoadingSpinner = () => {
	return (
		// Contêiner principal que centraliza o spinner na tela.
		<div className='flex items-center justify-center min-h-screen bg-black'>
			{/* Contêiner relativo para posicionar os elementos do spinner. */}
			<div className='relative'>
				{/* O primeiro div cria o círculo de fundo estático do spinner. */}
				<div className='w-20 h-20 border-white border-2 rounded-full' />
				{/* O segundo div cria o arco giratório. A classe 'animate-spin' do Tailwind aplica a animação de rotação. */}
				<div className='w-20 h-20 border-white border-t-2 animate-spin rounded-full absolute left-0 top-0' />
				{/* Elemento para acessibilidade: fornece texto para leitores de tela. */}
				<div className='sr-only'>Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
