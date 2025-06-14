import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		const validCartItems = req.user.cartItems.filter(item => typeof item === 'object' && item.product);

		if (validCartItems.length === 0) {
			return res.json([]);
		}

		const productIds = validCartItems.map((item) => item.product);
		const products = await Product.find({ _id: { $in: productIds } }).lean();
		const productMap = new Map(products.map(p => [p._id.toString(), p]));

		const cartDetails = validCartItems.map(cartItem => {
			const productDetail = productMap.get(cartItem.product.toString());

			if (!productDetail) {
				return null;
			}

			return {
				...productDetail,
				_id: productDetail._id.toString(),
				quantity: cartItem.quantity,
				size: cartItem.size
			};
		}).filter(item => item !== null);

		res.json(cartDetails);

	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId, size } = req.body;
		const user = req.user;

		if (!size) {
			return res.status(400).json({ message: "Product size is required" });
		}

		user.cartItems = user.cartItems.filter(item => typeof item === 'object' && item.product);

		const existingItem = user.cartItems.find(
			(item) => item.product.toString() === productId && item.size === size
		);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ product: productId, size: size, quantity: 1 });
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId, size } = req.body;
		const user = req.user;

		if (!productId) {
			user.cartItems = [];
		} else if (size) {
			user.cartItems = user.cartItems.filter(
				(item) => !(item.product.toString() === productId && item.size === size)
			);
		} else {
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

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity, size } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find(
			(item) => (item.product.toString() === productId && item.size === size)
		);

		if (existingItem) {
			if (quantity <= 0) {
				user.cartItems = user.cartItems.filter(
					(item) => !(item.product.toString() === productId && item.size === size)
				);
			} else {
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