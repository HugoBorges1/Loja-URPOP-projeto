import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  const inputClasses =
    "block w-full px-3 py-2 pl-10 bg-black border border-white rounded-md " +
    "placeholder-gray-500 font-bold focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm";

  return (

    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <motion.div
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >

        <div className=' py-2 px-4 shadow sm:rounded-lg sm:px-10'>
          <h2 className='mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text'>
            Crie sua conta
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6 py-8'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-white'>
                Nome completo
              </label>

              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-white' aria-hidden='true' />
                </div>

                <div className='rounded-md text-boldfocus-within:p-px focus-within:bg-gradient-to-r from-[#606cfc] to-[#ff64c4]'>
                  <input
                    id='name'
                    type='text'
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                    placeholder='Digite seu nome completo'
                  />
                </div>
              </div>
            </div>

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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                    placeholder='voce@exemplo.com'
                  />
                </div>
              </div>
            </div>

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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={inputClasses}
                    placeholder='••••••••'
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-white'>
                Confirme sua senha
              </label>

              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-white' aria-hidden='true' />
                </div>

                <div className='rounded-md focus-within:p-px focus-within:bg-gradient-to-r from-[#606cfc] to-[#ff64c4]'>
                  <input
                    id='confirmPassword'
                    type='password'
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={inputClasses}
                    placeholder='••••••••'
                  />
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='w-full flex items-center justify-center rounded-lg px-12 py-2 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-violet-300 dark:focus:ring-violet-800 bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-90 transition-all duration-200 whitespace-nowrap'
              disabled={loading}

            >
              {loading ? (
                <>
                  <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                  Carregando...
                </>

              ) : (

                <>
                  <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                  Criar conta
                </>
              )}
            </button>
          </form>

          <p className='mt-8 text-center text-sm text-white'>
            Já tem uma conta?{" "}
            <Link
              to='/login'
              className='font-medium inline-flex items-center gap-1 group'
            >
              <span className='bg-gradient-to-r from-[#606cfc] to-[#ff64c4] text-transparent bg-clip-text group-hover:brightness-90'>
                Entre aqui
              </span>
              <ArrowRight className='inline h-4 w-4 text-[#ff64c4] transition-transform group-hover:translate-x-1' />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;