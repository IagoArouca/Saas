import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';

export const Login = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state: any) => state.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { user, accessToken } = res.data;

      setAuth(user, accessToken);

      if (user.role === 'DEV') {
        navigate('/dashboard/dev');
      } else if (user.role === 'RECRUITER') {
        navigate('/dashboard/recruiter');
      } else {

        navigate('/dashboard/dev');
      }
      
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <LogIn className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta</h1>
          <p className="text-slate-400 text-sm mt-1">Acesse sua mochila e continue sua jornada.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">E-mail</label>
            <input 
              {...register('email')}
              type="email" 
              placeholder="exemplo@dev.com" 
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all placeholder:text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Senha</label>
            <input 
              {...register('password')}
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all placeholder:text-slate-700"
              required
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/10"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar na Mochila'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Novo por aqui?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
          >
            Crie sua conta
          </button>
        </p>
      </div>
    </div>
  );
};