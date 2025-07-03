import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import path from "path";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"
import orderRoutes from "./routes/order.route.js";

import { connectDB } from "./lib/db.js";

// Carrega as variáveis de ambiente do arquivo .env.
dotenv.config();

// Inicializa a aplicação Express.
const app = express();
const PORT = process.env.PORT || 5000;
// Resolve o caminho do diretório atual.
const __dirname = path.resolve()

// Middleware para interpretar o corpo das requisições como JSON.
// O limite de "10mb" é definido para aceitar imagens em formato base64.
app.use(express.json({ limit: "10mb" }));
// Middleware para interpretar os cookies enviados nas requisições.
app.use(cookieParser());

// Define as rotas principais da API, associando cada caminho a seu respectivo router.
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);

// Bloco de código que só é executado em ambiente de produção.
if (process.env.NODE_ENV === "production") {
    // Serve os arquivos estáticos da build do frontend (React).
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    // Para qualquer outra rota que não seja da API, serve o arquivo index.html do frontend.
    // Isso permite que o React Router cuide do roteamento no lado do cliente.
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

// Inicia o servidor na porta especificada.
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    // Conecta ao banco de dados assim que o servidor é iniciado.
    connectDB();
});
