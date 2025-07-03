import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import TermsOfServicePage from "./pages/TermsOfServicePage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Componente raiz da aplicação.
function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const location = useLocation();
  // Define as rotas que não devem exibir o fundo animado.
  const noBackgroundRoutes = ['/login', '/signup', '/secret-dashboard', '/purchase-cancel'];
  const showAnimatedBackground = !noBackgroundRoutes.includes(location.pathname);

  // Hook para verificar a autenticação do usuário quando a aplicação é carregada.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Hook para buscar os itens do carrinho sempre que o usuário mudar (ex: ao fazer login).
  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);

  // Enquanto a verificação de autenticação estiver em andamento, exibe um spinner de carregamento.
  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className='flex flex-col min-h-screen bg-black text-white relative overflow-hidden'>

      {/* Renderiza o fundo animado condicionalmente. */}
      {showAnimatedBackground && <AnimatedBackground />}

      <header className='relative z-50'>
        <Navbar />
      </header>

      <main className='flex-grow relative z-10 pt-16'>

        {/* Componente para rolar a página para o topo a cada mudança de rota. */}
        <ScrollToTop />
        {/* Define o sistema de roteamento da aplicação. */}
        <Routes>
          <Route path='/' element={<HomePage />} />
          {/* Rotas protegidas: só são acessíveis se o usuário não estiver logado. */}
          <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
          {/* Rota de administrador: só é acessível se o usuário tiver o papel 'Admin'. */}
          <Route path='/secret-dashboard' element={user?.role === "Admin" ? <AdminPage /> : <Navigate to='/login' />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path='/category/:category' element={<CategoryPage />} />
          {/* Rotas protegidas: só são acessíveis se o usuário estiver logado. */}
          <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
          <Route path='/my-orders' element={user ? <MyOrdersPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
          {/* Rotas públicas. */}
          <Route path='/about-us' element={<AboutUsPage />} />
          <Route path='/terms-of-service' element={<TermsOfServicePage />} />
          <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
        </Routes>
      </main>

      <footer className="relative z-50">
        <Footer />
      </footer>

      {/* Componente para exibir notificações (toasts) em toda a aplicação. */}
      <Toaster />
    </div>
  );
}

export default App;
