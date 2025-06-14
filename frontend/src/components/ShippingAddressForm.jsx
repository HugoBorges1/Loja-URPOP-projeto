import { useCartStore } from "../stores/useCartStore";

const ShippingAddressForm = () => {
    const { shippingAddress, setShippingAddress } = useCartStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress({ [name]: value });
    };

    const inputClasses = "w-full p-2 bg-black border border-gray-600 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-pink-400";

    return (
        <div className="rounded-lg bg-gradient-to-r from-[#606cfc] to-[#ff64c4] p-px">
            <div className="space-y-4 rounded-lg bg-black p-4 shadow-sm sm:p-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text">
                    Endereço de Entrega
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="street" className="mb-2 block text-sm font-medium text-gray-300">Rua e Número</label>
                        <input type="text" name="street" value={shippingAddress.street} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="neighborhood" className="mb-2 block text-sm font-medium text-gray-300">Bairro</label>
                        <input type="text" name="neighborhood" value={shippingAddress.neighborhood} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-300">Cidade</label>
                        <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="postalCode" className="mb-2 block text-sm font-medium text-gray-300">CEP</label>
                        <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-300">País</label>
                        <input type="text" name="country" value={shippingAddress.country} onChange={handleChange} className={inputClasses} required />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingAddressForm;