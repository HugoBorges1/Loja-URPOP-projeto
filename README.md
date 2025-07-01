Para rodar essa aplicação localmente, você deverá:

Instalar o Node.js
Instalar o VScode

Baixar os arquivos (.zip) do respositório

Extrair os documentos e abrir a pasta no VScode

Adicione o arquivo ".env" na raiz do projeto, este arquivo deve ser configurado da seguinte maneira (copie e cole no .end):

    ACCESS_TOKEN_SECRET=acess_token_secret
    REFRESH_TOKEN_SECRET=refresh_token_secret
    CLOUDINARY_API_KEY=[Sua_chave_publica_do_cloudinary]
    CLOUDINARY_API_SECRET=[Sua_chave_privada_do_cloudinary]
    CLOUDINARY_CLOUD_NAME=[Sua_cloud_do_cloudinary]
    MONGO_URI=[Seu_banco_de_dados_mongodb]
    STRIPE_SECRET_KEY=[Sua_chave_secreta_do_stripe]
    UPSTASH_REDIS_URL=[Sua_chave_do_redis]
    PORT=5000
    CLIENT_URL=http://localhost:5173

Alterar "package.json" da pasta raiz removendo a linha abaixo:

    "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"

Alterar o arquivo "server.js" na pasta backend (copie e cole o conteúdo abaixo no "server.js"):

    import express from "express";
    import dotenv from "dotenv";
    import cookieParser from 'cookie-parser';
    import authRoutes from "./routes/auth.route.js";
    import productRoutes from "./routes/product.route.js";
    import cartRoutes from "./routes/cart.route.js";
    import couponRoutes from "./routes/coupon.route.js";
    import paymentRoutes from "./routes/payment.route.js"
    import analyticsRoutes from "./routes/analytics.route.js"
    import orderRoutes from "./routes/order.route.js";
    
    import { connectDB } from "./lib/db.js";
    
    dotenv.config();
    
    const app = express();
    const PORT = process.env.PORT || 5000;
    
    app.use(express.json({ limit: "10mb" }));
    app.use(cookieParser());
    
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/coupons", couponRoutes);
    app.use("/api/payments", paymentRoutes);
    app.use("/api/analytics", analyticsRoutes);
    app.use("/api/orders", orderRoutes);
    
    app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
        connectDB();
    });

Acesse o terminal do VScode

Execute o comando abaixo na raiz do projeto:

    npm i express dotenv mongoose jsonwebtoken stripe cloudinary cookie-parser bcryptjs ioredis

Se por ventura, enfrentar o seguinte erro:

    npm : O arquivo C:\Program Files\nodejs\npm.ps1 não pode ser carregado porque a execução de scripts foi desabilitada neste sistema. Para obter mais informações, consulte about_Execution_Policies em 
    https://go.microsoft.com/fwlink/?LinkID=135170.
    No linha:1 caractere:1
    + npm i express dotenv mongoose jsonwebtoken stripe cloudinary cookie-p ...
    + ~~~
        + CategoryInfo          : ErrodeSegurança: (:) [], PSSecurityException 
        + FullyQualifiedErrorId : UnauthorizedAccess
    
    
    	Acesse o power shell do windows (em modo administrador):

Execute no terminal: 
  Get-ExecutionPolicy

Se a saída for restricted, execute o seguinte comando: 
  Set-ExecutionPolicy RemoteSigned

Agora sim, execute na raiz do projeto: npm i express dotenv mongoose jsonwebtoken stripe cloudinary cookie-parser bcryptjs ioredis

Digite no terminal: cd ./frontend/ 

Execute o seguinte comando: 
npm install

Agora, com todas as dependências instaladas e com o ".env" configurado, você está pronto para executar a aplicação localmente.

Abra duas instâncias do terminal no vs code, a instância que estiver na raiz do projeto, execute:

    npm run dev

Na outra instância, escreva "cd ./frontend/" e execute:

    npm run dev

Agora abra o link provido e a aplicação estará rodando.
