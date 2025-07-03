import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Controlador para buscar um único produto pelo seu ID.
export const getProductById = async (req, res) => {
	try {
		// Encontra o produto no banco de dados usando o ID fornecido nos parâmetros da rota.
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json(product);
	} catch (error) {
		console.log("Error in getProductById controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para buscar todos os produtos cadastrados.
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json({ products });
	} catch (error) {
		console.log("Error in getALLProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para buscar produtos marcados como "destaque", utilizando cache com Redis.
export const getFeaturedProducts = async (req, res) => {
	try {
		// Tenta buscar a lista de produtos em destaque do cache do Redis primeiro.
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			// Se encontrar no cache, retorna os dados diretamente, evitando uma consulta ao banco de dados.
			return res.json(JSON.parse(featuredProducts));
		}

		// Se não estiver no cache, busca no banco de dados os produtos com 'isFeatured: true'.
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// Salva a lista de produtos em destaque no cache do Redis para futuras requisições.
		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para criar um novo produto.
export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		// Se uma imagem foi enviada (em formato base64), faz o upload para o Cloudinary.
		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		// Cria o novo produto no banco de dados com a URL da imagem retornada pelo Cloudinary.
		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para deletar um produto.
export const deleteProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const product = await Product.findById(productId);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const wasFeatured = product.isFeatured;

		// Se o produto tiver uma imagem, deleta-a do Cloudinary.
		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		// Deleta o produto do banco de dados.
		await Product.findByIdAndDelete(productId);
		// Remove o produto deletado do carrinho de todos os usuários.
		await User.updateMany(
			{},
			{ $pull: { cartItems: { product: productId } } }
		);

		// Se o produto deletado estava em destaque, atualiza o cache do Redis.
		if (wasFeatured) {
			await updateFeaturedProductsCache();
		}

		res.json({ message: "Product deleted successfully and carts cleaned" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para buscar produtos recomendados (seleciona 4 produtos aleatoriamente).
export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			// O '$sample' é um estágio de agregação do MongoDB que seleciona documentos aleatoriamente.
			{
				$sample: { size: 4 },
			},
			// O '$project' seleciona quais campos dos documentos devem ser retornados.
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para buscar produtos por uma categoria específica.
export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para alternar o status de "destaque" de um produto.
export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			// Inverte o valor booleano da propriedade 'isFeatured'.
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			// Atualiza o cache de produtos em destaque no Redis.
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Função auxiliar para atualizar o cache de produtos em destaque no Redis.
async function updateFeaturedProductsCache() {
	try {
		// Busca todos os produtos que estão marcados como destaque.
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		// Armazena a lista atualizada no Redis.
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
};
