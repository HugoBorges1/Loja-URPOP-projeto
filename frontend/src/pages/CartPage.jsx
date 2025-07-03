import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
// Importa os componentes que formam a página do carrinho.
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import ShippingAddressForm from "../components/ShippingAddressForm";

// Componente principal da página do carrinho de compras.
const CartPage = () => {
  // Desestrutura o estado 'cart' do store para saber quais itens exibir e se o carrinho está vazio.
  const { cart } = useCartStore();

  return (
    <div className='py-8 md:py-16'>
      <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
        {/* Layout principal que se divide em duas colunas em telas grandes. */}
        <div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
          {/* Coluna da esquerda: contém a lista de itens do carrinho. */}
          <motion.div
            className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Renderização condicional: verifica se o carrinho está vazio. */}
            {cart.length === 0 ? (
              // Se estiver vazio, renderiza a interface de carrinho vazio.
              <EmptyCartUI />
            ) : (
              // Se houver itens, renderiza a lista de componentes 'CartItem'.
              <div className='space-y-6'>
                {cart.map((item) => (
                  <CartItem key={`${item._id}-${item.size}`} item={item} />
                ))}
              </div>
            )}
            {/* A seção "Pessoas também compram" só aparece se o carrinho não estiver vazio. */}
            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          {/* Coluna da direita (sidebar): só é renderizada se houver itens no carrinho. */}
          {cart.length > 0 && (
            <motion.div
              className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Renderiza os componentes da sidebar: formulário de endereço, resumo do pedido e cupom. */}
              <ShippingAddressForm />
              <OrderSummary />
              <GiftCouponCard />
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};
export default CartPage;

// Componente separado para a interface de usuário quando o carrinho está vazio.
const EmptyCartUI = () => (
  <motion.div
    className='flex flex-col items-center justify-center space-y-4 py-16'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart className='h-24 w-24 text-white' />
    <h3 className='text-2xl font-semibold '>Seu carrinho está vazio</h3>
    <p className='text-white'>Parece que você não adicionou nada ao seu carrinho ainda.</p>
    <Link
      className='mt-4 rounded-md bg-gradient-to-r from-[#606cfc] to-[#ff64c4] brightness-120 px-6 py-2 text-white transition-colors hover:bg-emerald-600'
      to='/'
    >
      Começar a comprar
    </Link>
  </motion.div>
);
