import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Componente utilitário que rola a janela para o topo sempre que a rota muda.
function ScrollToTop() {
  // O hook 'useLocation' retorna o objeto de localização atual, que contém informações sobre a URL.
  const { pathname } = useLocation();

  // O hook 'useEffect' é executado sempre que o valor de 'pathname' (o caminho da URL) muda.
  useEffect(() => {
    // 'window.scrollTo(0, 0)' rola a janela para as coordenadas (0, 0), ou seja, o topo da página.
    window.scrollTo(0, 0);
  }, [pathname]); // O array de dependências garante que o efeito seja re-executado a cada mudança de rota.

  // Este componente não renderiza nada na tela, sua única função é executar o efeito colateral de rolagem.
  return null;
}

export default ScrollToTop;
