import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';

export const Login = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { user, accessToken } = res.data;

      setAuth(user, accessToken);

      if (user.role === 'DEV') navigate('/dashboard/dev');
      else if (user.role === 'RECRUITER') navigate('/dashboard/recruiter');
      else if (user.role === 'CONTENT_CREATOR') navigate('/dashboard/creator');
      
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <LogIn className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="text-slate-400 text-sm mt-1">Acesse sua mochila e continue sua jornada.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input 
            {...register('email')}
            type="email" 
            placeholder="E-mail" 
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 outline-none text-white transition-all"
            required
          />
          <input 
            {...register('password')}
            type="password" 
            placeholder="Senha" 
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 outline-none text-white transition-all"
            required
          />
          
          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar na Mochila'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Novo por aqui? <span onClick={() => navigate('/register')} className="text-blue-400 cursor-pointer hover:underline">Crie sua conta</span>
        </p>
      </div>
    </div>
  );
};