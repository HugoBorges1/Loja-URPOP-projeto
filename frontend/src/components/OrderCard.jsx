import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { useOrderStore } from "../stores/useOrderStore";

const OrderCard = ({ order, isInitiallyOpen = false }) => {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);
    const { confirmDelivery } = useOrderStore();

    const statusColors = {
        "em processamento": "bg-yellow-500/20 text-yellow-400",
        "confirmado": "bg-blue-500/20 text-blue-400",
        "enviado": "bg-green-500/20 text-green-400",
        "recebido": "bg-gray-500/20 text-gray-400",
    };

    return (
        <div className="rounded-lg p-px bg-gradient-to-r from-[#606cfc] to-[#ff64c4]">
            <div className="bg-black rounded-lg p-6">
                <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <div>
                        <p className="text-sm text-gray-400">Pedido #{order.orderNumber}</p>
                        <p className="text-lg font-bold text-white">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="text-right">
                            <p className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[order.status]}`}>
                                {order.status}
                            </p>
                            <p className="text-xl font-bold text-white mt-1">R$ {order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="mt-2">
                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                        <h4 className="font-bold mb-4 text-white">Itens do Pedido:</h4>
                        {order.products.map((item) => (
                            <div key={item._id} className="flex justify-between items-center mb-2 text-gray-300">
                                <p className={!item.product ? 'text-gray-500 italic' : ''}>
                                    {item.product ? item.product.name : '[Produto Removido]'} (x{item.quantity})
                                </p>
                                <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="border-t border-gray-700 my-2"></div>
                        <div className="flex justify-between font-bold text-white">
                            <p>Subtotal:</p>
                            <p>R$ {(order.totalAmount - order.shippingCost).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <p>Frete:</p>
                            <p>R$ {order.shippingCost.toFixed(2)}</p>
                        </div>

                        <h4 className="font-bold mt-4 mb-2 text-white">Endereço de Entrega:</h4>

                        {order.shippingAddress && order.shippingAddress.line1 ? (
                            <p className="text-gray-300">
                                {order.shippingAddress.line1}
                                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
                                <br />
                                {order.shippingAddress.city}
                                {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}
                                {` - ${order.shippingAddress.postal_code}`}
                                <br />
                                {order.shippingAddress.country}
                            </p>
                        ) : (
                            <p className="text-gray-500 italic">[Endereço não disponível]</p>
                        )}

                        {order.status === 'enviado' && (
                            <div className="mt-6">
                                <button
                                    onClick={() => confirmDelivery(order._id)}
                                    className="w-full flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                                >
                                    <CheckCircle size={18} className="mr-2" />
                                    Confirmar Entrega
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;