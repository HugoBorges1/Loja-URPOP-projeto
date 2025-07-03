import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define o schema (a estrutura) para os usuários no banco de dados.
const userSchema = new mongoose.Schema(
    {
        // Nome do usuário.
        name: {
            type: String,
            required: [true, "Name is required"], // O campo é obrigatório.
        },
        // E-mail do usuário, usado para login.
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,       // Garante que cada e-mail seja único na coleção.
            lowercase: true,    // Converte o e-mail para letras minúsculas.
            trim: true,         // Remove espaços em branco do início e do fim.
        },
        // Senha do usuário.
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"], // Define um comprimento mínimo para a senha.
        },
        // Carrinho de compras do usuário, armazenado como um array de itens.
        cartItems: [
            {
                // Quantidade de um produto específico no carrinho.
                quantity: {
                    type: Number,
                    default: 1,
                },
                // Referência ao ID do produto.
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product", // Aponta para o model 'Product'.
                },
                // Tamanho do produto selecionado.
                size: {
                    type: String,
                    required: true,
                }
            },
        ],
        // Papel do usuário no sistema, limitado aos valores do enum.
        role: {
            type: String,
            enum: ["Customer", "Admin"], // O papel só pode ser 'Customer' ou 'Admin'.
            default: "Customer",        // O valor padrão para novos usuários é 'Customer'.
        },

    },
    {
        // Adiciona automaticamente os campos 'createdAt' e 'updatedAt' a cada documento.
        timestamps: true,
    }
);

// Middleware (hook) que é executado ANTES de salvar um documento de usuário.
userSchema.pre("save", async function (next) {
    // Se a senha não foi modificada, não faz nada e passa para o próximo passo.
    if (!this.isModified("password")) return next();

    try {
        // Gera um "salt" para adicionar aleatoriedade ao hash da senha.
        const salt = await bcrypt.genSalt(10);
        // Criptografa a senha do usuário com o salt gerado.
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Continua com a operação de salvar.
    } catch (error) {
        next(error);
    }
});

// Adiciona um método personalizado ao schema para comparar senhas.
userSchema.methods.comparePassword = async function (password) {
    // Compara a senha fornecida (ex: no login) com a senha criptografada armazenada no banco de dados.
    return bcrypt.compare(password, this.password);
};

// Cria o modelo 'User' a partir do schema, que será usado para interagir com a coleção de usuários.
const User = mongoose.model("User", userSchema);

export default User;
