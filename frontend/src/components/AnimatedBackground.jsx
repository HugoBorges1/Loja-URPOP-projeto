import React, { useEffect, useRef } from 'react';

// Componente que renderiza um fundo animado com efeito de "chuva digital".
const AnimatedBackground = () => {
  const canvasRef = useRef(null); // Cria uma referência para o elemento canvas.

  useEffect(() => {
    // A lógica da animação é colocada dentro de um useEffect para ser executada após a montagem do componente.

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d'); // Obtém o contexto 2D do canvas para desenhar.
    if (!ctx) return;

    let animationFrameId;
    const numTracks = 120; // Número de "colunas" de chuva na tela.
    let tracks = [];
    let charSize;

    // Função para inicializar ou reiniciar a animação.
    const initialize = () => {
      canvas.width = window.innerWidth; // Define a largura do canvas para a largura da janela.
      canvas.height = window.innerHeight; // Define a altura do canvas para a altura da janela.
      const trackWidth = canvas.width / numTracks;
      // Calcula o tamanho de cada "caractere" da chuva com base na largura da trilha.
      charSize = Math.max(1, Math.floor(trackWidth * 0.5));
      if (trackWidth < 3) charSize = 1;

      tracks = [];
      // Cria cada "trilha" de chuva com propriedades aleatórias.
      for (let i = 0; i < numTracks; i++) {
        // Define um comprimento máximo aleatório para a cauda de cada trilha.
        let currentMaxLength = Math.floor(canvas.height / (charSize * 2)) + Math.floor(Math.random() * (canvas.height / (charSize * 3)));
        currentMaxLength = Math.max(30, Math.min(currentMaxLength, Math.floor(canvas.height / charSize * 0.9)));

        if (charSize <= 0) currentMaxLength = 150;

        tracks.push({
          x: i * trackWidth + (trackWidth - charSize) / 2, // Posição X da trilha.
          y: Math.random() * canvas.height, // Posição Y inicial aleatória.
          speed: 1.0 + Math.random() * 3.0, // Velocidade de queda aleatória.
          baseLightness: 20 + Math.random() * 70, // Brilho base aleatório.
          trail: [], // Array para armazenar os segmentos da cauda.
          maxLength: currentMaxLength, // Comprimento máximo da cauda.
        });
      }
    };

    // Função principal de desenho, que é chamada repetidamente para criar a animação.
    const draw = () => {
      // Desenha um retângulo preto semi-transparente para criar o efeito de "rastro".
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      tracks.forEach(track => {
        // Adiciona um novo segmento à cauda da trilha na posição atual.
        const newSegment = {
          yPos: track.y,
          lightness: track.baseLightness,
        };
        track.trail.unshift(newSegment);

        // Remove os segmentos mais antigos para manter o comprimento da cauda.
        while (track.trail.length > track.maxLength) {
          track.trail.pop();
        }

        // Desenha cada segmento da cauda com brilho e opacidade decrescentes.
        track.trail.forEach((segment, index) => {
          const ageRatio = index / track.trail.length;
          const alpha = 0.05 + (1 - ageRatio) * 0.8; // Opacidade diminui com a idade.

          let displayLightness = segment.lightness;
          // O primeiro segmento (a "cabeça") é mais brilhante.
          if (index > 0) {
            displayLightness = Math.max(10, segment.lightness - (ageRatio * 40));
          } else {
            displayLightness = Math.min(95, segment.lightness + 10);
          }
          const finalLightness = Math.max(10, Math.min(95, displayLightness));
          ctx.fillStyle = `hsla(0, 0%, ${finalLightness}%, ${alpha})`;

          ctx.fillRect(Math.floor(track.x), Math.floor(segment.yPos), charSize, charSize);
        });

        // Move a trilha para baixo de acordo com sua velocidade.
        track.y += track.speed;

        // Se a trilha sair da tela, reinicia sua posição e propriedades.
        if (track.y > canvas.height + (track.maxLength * charSize * 0.1)) {
          track.y = -Math.random() * (canvas.height * 0.2);
          track.trail = [];
          track.baseLightness = 20 + Math.random() * 70;
          track.speed = 1.0 + Math.random() * 2.0;

          let newMaxLength = Math.floor(canvas.height / (charSize * 2)) + Math.floor(Math.random() * (canvas.height / (charSize * 3)));
          newMaxLength = Math.max(30, Math.min(newMaxLength, Math.floor(canvas.height / charSize * 0.9)));
          if (charSize <= 0) newMaxLength = 1500;
          track.maxLength = newMaxLength;
        }
      });

      // Solicita o próximo quadro da animação.
      animationFrameId = requestAnimationFrame(draw);
    };

    initialize(); // Inicializa a animação.
    draw();       // Inicia o loop de desenho.

    // Função para lidar com o redimensionamento da janela.
    const handleResize = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      initialize();
      draw();
    };

    window.addEventListener('resize', handleResize);

    // Função de limpeza: remove o event listener e cancela a animação quando o componente é desmontado.
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // O array de dependências vazio garante que o useEffect seja executado apenas uma vez.

  return (
    // Renderiza o elemento canvas que será usado para a animação.
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default AnimatedBackground;
