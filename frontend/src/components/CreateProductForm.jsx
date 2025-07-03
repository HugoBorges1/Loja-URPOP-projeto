import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["filmes", "series", "animes", "jogos", "musicas", "memes"];

// Componente de formulário para criar um novo produto no painel de administrador.
const CreateProductForm = () => {

    // Estado para armazenar os dados do novo produto que está sendo preenchido no formulário.
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });

    // Desestrutura as funções e estados necessários do store de produtos (Zustand).
    const { createProduct, loading } = useProductStore();

    // Função para lidar com o envio do formulário.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o comportamento padrão de recarregar a página.
        try {
            // Chama a função 'createProduct' do store para enviar os dados para a API.
            await createProduct(newProduct);
            // Limpa os campos do formulário após a criação bem-sucedida.
            setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
        } catch {
            console.log("error creating a product");
        }
    };

    // Função para lidar com a seleção de um arquivo de imagem.
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Usa o FileReader para converter a imagem em uma string base64.
            const reader = new FileReader();

            reader.onloadend = () => {
                // Quando a leitura estiver concluída, atualiza o estado com a imagem em base64.
                setNewProduct({ ...newProduct, image: reader.result });
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>

            <motion.div
                className='bg-black shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className='text-2xl font-semibold mb-6 bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>Criar novo produto</h2>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* Campos do formulário para nome, descrição, preço e categoria. */}
                    <div>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                            Nome do produto
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className='mt-1 block w-full bg-black border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-pink-400 focus:border-pink-400'
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                            Descrição
                        </label>
                        <textarea
                            id='description'
                            name='description'
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            rows='3'
                            className='mt-1 block w-full bg-black border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 
						 focus:border-pink-400'
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
                            Preço
                        </label>
                        <input
                            type='number'
                            id='price'
                            name='price'
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            step='0.01'
                            className='mt-1 block w-full bg-black border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-400
						 focus:border-pink-400'
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
                            Categoria
                        </label>
                        <select
                            id='category'
                            name='category'
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className='mt-1 block w-full bg-black border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-pink-400 focus:border-pink-400'
                            required
                        >
                            <option value=''>Selecione uma categoria</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo para upload da imagem do produto. */}
                    <div className='mt-1 flex items-center'>
                        <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                        <label
                            htmlFor='image'
                            className='cursor-pointer bg-black py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400'>
                            <Upload className='h-5 w-5 inline-block mr-2' />
                            Imagem do produto
                        </label>
                        {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
                    </div>

                    {/* Botão de envio do formulário, que mostra um estado de carregamento. */}
                    <button
                        type='submit'
                        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-120 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 disabled:opacity-50'
                        disabled={loading}
                    >
                        {/* Renderização condicional do conteúdo do botão com base no estado 'loading'. */}
                        {loading ? (
                            <>
                                <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                                Carregando...
                            </>
                        ) : (
                            <>
                                <PlusCircle className='mr-2 h-5 w-5' />
                                Criar produto
                            </>
                        )}
                    </button>

                </form>

            </motion.div>

        </div>
    );
};

export default CreateProductForm;
