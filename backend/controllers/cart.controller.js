import Product from "../models/product.model.js";

// Controlador para buscar e retornar os produtos no carrinho do usuário.
export const getCartProducts = async (req, res) => {
	try {
		// Filtra o array 'cartItems' para remover quaisquer itens inválidos que não sejam objetos ou não tenham uma propriedade 'product'.
		const validCartItems = req.user.cartItems.filter(item => typeof item === 'object' && item.product);

		// Se não houver itens válidos no carrinho, retorna um array vazio.
		if (validCartItems.length === 0) {
			return res.json([]);
		}

		// Extrai os IDs dos produtos do carrinho para buscar seus detalhes no banco de dados.
		const productIds = validCartItems.map((item) => item.product);
		// Busca todos os produtos correspondentes aos IDs de uma só vez para otimizar a consulta.
		const products = await Product.find({ _id: { $in: productIds } }).lean();
		// Cria um mapa (Map) para acesso rápido aos detalhes do produto pelo seu ID.
		const productMap = new Map(products.map(p => [p._id.toString(), p]));

		// Combina os detalhes dos produtos com as informações do carrinho (quantidade e tamanho).
		const cartDetails = validCartItems.map(cartItem => {
			const productDetail = productMap.get(cartItem.product.toString());

			// Se por algum motivo um produto do carrinho não for encontrado no banco de dados, ele é ignorado.
			if (!productDetail) {
				return null;
			}

			// Retorna um novo objeto com todos os detalhes do produto mais a quantidade e o tamanho específicos do item no carrinho.
			return {
				...productDetail,
				_id: productDetail._id.toString(),
				quantity: cartItem.quantity,
				size: cartItem.size
			};
		}).filter(item => item !== null); // Remove quaisquer itens nulos (produtos não encontrados).

		res.json(cartDetails);

	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para adicionar um produto ao carrinho.
export const addToCart = async (req, res) => {
	try {
		const { productId, size } = req.body;
		const user = req.user;

		// Valida se o tamanho do produto foi fornecido.
		if (!size) {
			return res.status(400).json({ message: "Product size is required" });
		}

		// Garante que o carrinho contenha apenas itens válidos antes de adicionar um novo.
		user.cartItems = user.cartItems.filter(item => typeof item === 'object' && item.product);

		// Verifica se um item com o mesmo produto e tamanho já existe no carrinho.
		const existingItem = user.cartItems.find(
			(item) => item.product.toString() === productId && item.size === size
		);

		// Se o item já existe, apenas incrementa a quantidade.
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			// Se não existe, adiciona o novo item ao carrinho.
			user.cartItems.push({ product: productId, size: size, quantity: 1 });
		}

		// Salva as alterações no documento do usuário.
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para remover itens do carrinho.
export const removeAllFromCart = async (req, res) => {
	try {
		const { productId, size } = req.body;
		const user = req.user;

		// Se nenhum 'productId' for fornecido, esvazia o carrinho inteiro.
		if (!productId) {
			user.cartItems = [];
			// Se 'productId' e 'size' forem fornecidos, remove o item específico (produto + tamanho).
		} else if (size) {
			user.cartItems = user.cartItems.filter(
				(item) => !(item.product.toString() === productId && item.size === size)
			);
		} else {
			// Se apenas 'productId' for fornecido, remove todas as variações daquele produto (todos os tamanhos).
			user.cartItems = user.cartItems.filter(
				(item) => !(item.product.toString() === productId)
			);
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in removeAllFromCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Controlador para atualizar a quantidade de um item específico no carrinho.
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity, size } = req.body;
		const user = req.user;

		// Encontra o item no carrinho que corresponde ao produto e tamanho.
		const existingItem = user.cartItems.find(
			(item) => (item.product.toString() === productId && item.size === size)
		);

		if (existingItem) {
			// Se a quantidade for 0 ou menos, remove o item do carrinho.
			if (quantity <= 0) {
				user.cartItems = user.cartItems.filter(
					(item) => !(item.product.toString() === productId && item.size === size)
				);
			} else {
				// Caso contrário, atualiza a quantidade do item.
				existingItem.quantity = quantity;
			}
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found in cart" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
