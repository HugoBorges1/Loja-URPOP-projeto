import mongoose from 'mongoose';

// Define o schema (a estrutura) para os produtos no banco de dados.
const productSchema = new mongoose.Schema({
    // Nome do produto, que é obrigatório.
    name: {
        type: String,
        required: true
    },
    // Descrição detalhada do produto, também obrigatória.
    description: {
        type: String,
        required: true
    },
    // Preço do produto. Deve ser um número e não pode ser negativo.
    price: {
        type: Number,
        min: 0,
        required: true
    },
    // URL da imagem do produto, que é obrigatória.
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    // Categoria à qual o produto pertence (ex: 'filmes', 'séries').
    category: {
        type: String,
        required: true
    },
    // Um array de strings para os tamanhos disponíveis.
    sizes: {
        type: [String],
        required: true,
        // Define os tamanhos padrão se nenhum for fornecido.
        default: ['P', 'M', 'G']
    },
    // Um campo booleano para indicar se o produto deve ser exibido na seção de destaques.
    isFeatured: {
        type: Boolean,
        default: false
    }
    // Adiciona automaticamente os campos 'createdAt' e 'updatedAt' a cada documento.
}, { timestamps: true });

// Cria o modelo 'Product' a partir do schema definido, que será usado para interagir com a coleção de produtos.
const Product = mongoose.model("Product", productSchema);

export default Product;
