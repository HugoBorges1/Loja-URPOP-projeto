import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const router = express.Router();

// Define a rota principal GET para '/'. Esta rota é protegida e só pode ser acessada por administradores.
router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		// Busca os dados analíticos gerais (total de usuários, produtos, vendas, etc.).
		const analyticsData = await getAnalyticsData();

		// Define o intervalo de datas para os últimos 7 dias.
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		// Busca os dados de vendas diárias dentro do intervalo de datas definido.
		const dailySalesData = await getDailySalesData(startDate, endDate);

		// Retorna um objeto JSON contendo tanto os dados gerais quanto os dados de vendas diárias.
		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// Exporta o router para ser usado no arquivo principal do servidor.
export default router;
