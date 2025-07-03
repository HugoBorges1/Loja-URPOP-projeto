import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Função para buscar dados analíticos gerais da loja.
export const getAnalyticsData = async () => {
	// Conta o número total de usuários e produtos no banco de dados.
	const totalUsers = await User.countDocuments();
	const totalProducts = await Product.countDocuments();

	// Agrega os dados de todos os pedidos para calcular o total de vendas e a receita.
	const salesData = await Order.aggregate([
		{
			// Agrupa todos os documentos em um único grupo.
			$group: {
				_id: null,
				// Soma 1 para cada pedido encontrado, resultando no número total de vendas.
				totalSales: { $sum: 1 },
				// Soma o valor 'totalAmount' de cada pedido para obter a receita total.
				totalRevenue: { $sum: "$totalAmount" },
			},
		},
	]);

	// Extrai os dados de vendas e receita do resultado da agregação.
	// Se não houver vendas (salesData[0] é falso), define os valores como 0.
	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

	// Retorna um objeto com todos os dados analíticos compilados.
	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
};

// Função para buscar os dados de vendas diárias dentro de um intervalo de datas.
export const getDailySalesData = async (startDate, endDate) => {
	try {
		// Agrega os dados dos pedidos para calcular vendas e receita por dia.
		const dailySalesData = await Order.aggregate([
			{
				// Filtra os pedidos para incluir apenas aqueles dentro do intervalo de datas especificado.
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				// Agrupa os pedidos por data.
				$group: {
					// Converte a data de criação para o formato 'YYYY-MM-DD' para agrupar por dia.
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					// Conta o número de vendas para cada dia.
					sales: { $sum: 1 },
					// Soma a receita de todas as vendas do dia.
					revenue: { $sum: "$totalAmount" },
				},
			},
			// Ordena os resultados por data em ordem crescente.
			{ $sort: { _id: 1 } },
		]);

		// Gera um array com todas as datas no intervalo, para garantir que dias sem vendas sejam incluídos.
		const dateArray = getDatesInRange(startDate, endDate);

		// Mapeia o array de datas para criar o resultado final.
		return dateArray.map((date) => {
			// Procura os dados de venda para a data atual.
			const foundData = dailySalesData.find((item) => item._id === date);

			// Se encontrar dados para a data, usa-os; caso contrário, define vendas e receita como 0.
			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0,
			};
		});
	} catch (error) {
		throw error;
	}
};

// Função auxiliar para gerar um array de datas formatadas entre uma data inicial e final.
function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	// Itera do início ao fim do intervalo.
	while (currentDate <= endDate) {
		// Adiciona a data formatada como 'YYYY-MM-DD' ao array.
		dates.push(currentDate.toISOString().split("T")[0]);
		// Avança para o próximo dia.
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
};