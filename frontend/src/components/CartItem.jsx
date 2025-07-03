import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

// Componente que representa um único item dentro do carrinho de compras.
const CartItem = ({ item }) => {
    // Desestrutura as funções para remover e atualizar a quantidade do item do store do carrinho (Zustand).
    const { removeFromCart, updateQuantity } = useCartStore();

    return (
        <div className='rounded-lg bg-gradient-to-r from-[#606cfc] to-[#ff64c4] p-px'>
            <div className='rounded-lg bg-black p-4 md:p-6'>
                <div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
                    {/* Seção da imagem do produto. */}
                    <div className='shrink-0 md:order-1'>
                        <img className='h-20 w-20 md:h-24 md:w-24 rounded object-cover' src={item.image} alt={item.name} />
                    </div>
                    <label className='sr-only'>Choose quantity:</label>

                    {/* Seção para controle de quantidade e preço do item. */}
                    <div className='flex items-center justify-between md:order-3 md:justify-end'>
                        <div className='flex items-center gap-2'>
                            {/* Botão para diminuir a quantidade do item. */}
                            <button
                                className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-500 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400'
                                onClick={() => updateQuantity(item._id, item.quantity - 1, item.size)}
                            >
                                <Minus className='text-gray-300' />
                            </button>
                            <p className="w-4 text-center">{item.quantity}</p>
                            {/* Botão para aumentar a quantidade do item. */}
                            <button
                                className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-500 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400'
                                onClick={() => updateQuantity(item._id, item.quantity + 1, item.size)}
                            >
                                <Plus className='text-gray-300' />
                            </button>
                        </div>

                        {/* Exibe o preço total do item (preço unitário * quantidade). */}
                        <div className='text-end md:order-4 md:w-32'>
                            <p className='text-base font-bold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>
                                R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Seção com os detalhes do produto (nome, tamanho, descrição). */}
                    <div className='w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md'>
                        <p className='text-base font-medium bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text hover:brightness-60 hover:underline'>
                            {item.name}
                        </p>

                        {item.size && (
                            <p className="text-sm font-semibold text-white">Tamanho: <span className="text-white">{item.size}</span></p>
                        )}

                        <p className='text-sm text-white truncate'>{item.description}</p>

                        {/* Botão para remover o item completamente do carrinho. */}
                        <div className='flex items-center gap-4'>
                            <button
                                className='inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline'
                                onClick={() => removeFromCart(item._id, item.size)}
                            >
                                <Trash className="h-4 w-4" /> Remover
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CartItem;
