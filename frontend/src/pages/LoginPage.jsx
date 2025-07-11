import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

// Componente que renderiza a página de login.
const LoginPage = () => {
  // Estados para armazenar o e-mail and a senha digitados pelo usuário.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Desestrutura a função de login e o estado de carregamento do store de usuário (Zustand).
  const { login, loading } = useUserStore();

  // Função para lidar com o envio do formulário.
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página.
    login(email, password); // Chama a função de login do store com as credenciais.
  };

  // Define classes de CSS comuns para os campos de input para manter a consistência.
  const inputClasses =
    "block w-full px-3 py-2 pl-10 bg-black border border-white rounded-md " +
    "placeholder-gray-500 font-bold focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm";

  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      {/* Contêiner com animação de entrada para o formulário. */}
      <motion.div
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className='py-2 px-4 shadow sm:rounded-lg sm:px-10'>
          <h2 className='mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>
            Acesse sua conta
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6 py-8'>
            {/* Campo de input para o e-mail. */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-white'>
                Endereço de e-mail
              </label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-white' aria-hidden='true' />
                </div>
                <div className='rounded-md focus-within:p-px focus-within:bg-gradient-to-r from-[#606cfc] to-[#ff64c4]'>
                  <input
                    id='email'
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                    placeholder='voce@exemplo.com'
                  />
                </div>
              </div>
            </div>

            {/* Campo de input para a senha. */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-white'>
                Senha
              </label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-white' aria-hidden='true' />
                </div>
                <div className='rounded-md focus-within:p-px focus-within:bg-gradient-to-r from-[#606cfc] to-[#ff64c4]'>
                  <input
                    id='password'
                    type='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                    placeholder='••••••••'
                  />
                </div>
              </div>
            </div>

            {/* Botão de envio do formulário. */}
            <button
              type='submit'
              className='w-full flex items-center justify-center rounded-lg px-12 py-2 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-violet-300 dark:focus:ring-violet-800 bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-90 transition-all duration-200 whitespace-nowrap'
              disabled={loading}
            >
              {/* Renderização condicional: mostra um spinner de carregamento ou o texto "Entrar". */}
              {loading ? (
                <>
                  <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                  Carregando...
                </>
              ) : (
                <>
                  <LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Link para a página de cadastro para usuários que ainda não têm uma conta. */}
          <p className='mt-8 text-center text-sm text-white'>
            Não tem conta?{" "}
            <Link
              to='/signup'
              className='font-medium bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text hover:brightness-90'
            >
              Cadastre-se agora <ArrowRight className='inline h-4 w-4 text-[#ff64c4] transition-transform group-hover:translate-x-1' />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
