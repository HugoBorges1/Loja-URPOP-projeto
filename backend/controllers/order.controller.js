import Order from "../models/order.model.js";

// Controlador para buscar os pedidos do usuário autenticado.
export const getMyOrders = async (req, res) => {
    try {
        // Busca no banco de dados todos os pedidos associados ao ID do usuário logado.
        const orders = await Order.find({ user: req.user._id })
            // O '.populate()' substitui o ID do produto pelos detalhes completos do produto.
            .populate("products.product")
            // Ordena os pedidos do mais recente para o mais antigo.
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Controlador para buscar todos os pedidos (rota de administrador).
export const getAllOrders = async (req, res) => {
    try {
        // Busca todos os pedidos existentes no banco de dados.
        const orders = await Order.find({})
            // Popula os dados do usuário (nome e email) e dos produtos (nome) em cada pedido.
            .populate("user", "name email")
            .populate("products.product", "name")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Controlador para atualizar o status de um pedido (rota de administrador).
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        // Define os status permitidos que um administrador pode definir.
        const allowedStatuses = ["em processamento", "confirmado", "enviado"];

        // Valida se o status recebido está na lista de status permitidos.
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Status inválido para esta operação." });
        }

        const order = await Order.findById(req.params.id);

        if (order) {
            // Atualiza o status do pedido e salva a alteração.
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

// Controlador para deletar um pedido (rota de administrador).
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        // Encontra o pedido pelo ID e o remove do banco de dados.
        await Order.findByIdAndDelete(req.params.id);

        res.json({ message: "Pedido deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro de servidor", error: error.message });
    }
};

// Controlador para que o cliente confirme o recebimento de um pedido.
export const confirmOrderDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        // Verifica se o usuário que está fazendo a requisição é o mesmo que fez o pedido.
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Verifica se o pedido já foi enviado antes de poder ser confirmado como recebido.
        if (order.status !== 'enviado') {
            return res.status(400).json({ message: "O pedido ainda não foi enviado." });
        }

        // Atualiza o status do pedido para "recebido".
        order.status = "recebido";
        await order.save();
        res.json(order);

    } catch (error) {
        res.status(500).json({ message: "Erro de servidor", error: error.message });
    }
};
