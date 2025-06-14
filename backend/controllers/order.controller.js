import Order from "../models/order.model.js";

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("products.product")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("products.product", "name")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["em processamento", "confirmado", "enviado"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Status inválido para esta operação." });
        }

        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: "Pedido não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erro de servidor", error: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.json({ message: "Pedido deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro de servidor", error: error.message });
    }
};

export const confirmOrderDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Não autorizado" });
        }

        if (order.status !== 'enviado') {
            return res.status(400).json({ message: "O pedido ainda não foi enviado." });
        }

        order.status = "recebido";
        await order.save();
        res.json(order);

    } catch (error) {
        res.status(500).json({ message: "Erro de servidor", error: error.message });
    }
};