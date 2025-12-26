import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Code2, Briefcase, MonitorPlay, ChevronRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const roles = [
  {
    id: 'DEV',
    title: 'Desenvolvedor',
    desc: 'Organize seus estudos, projetos e seja visto por recrutadores.',
    icon: Code2,
    color: 'text-blue-500',
    accent: 'blue'
  },
  {
    id: 'RECRUITER',
    title: 'Recrutador',
    desc: 'Encontre os melhores talentos e gerencie suas contratações.',
    icon: Briefcase,
    color: 'text-emerald-500',
    accent: 'emerald'
  },
  {
    id: 'CONTENT_CREATOR',
    title: 'Criador',
    desc: 'Compartilhe conhecimento e direcione tráfego para seu canal.',
    icon: MonitorPlay,
    color: 'text-purple-500',
    accent: 'purple'
  }
];

export const Register = () => {
  const [selectedRole, setSelectedRole] = useState('DEV');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = { 
        ...data, 
        role: selectedRole 
      };
      
      await api.post('/auth/register', payload);
      
      alert('Conta criada com sucesso! Agora você pode fazer login.');
      navigate('/login');
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      alert(error.response?.data?.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Crie sua conta</h1>
          <p className="text-slate-400 mt-2">Como você pretende usar a Mochila do Dev?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedRole === role.id 
                ? `border-${role.accent}-500 bg-${role.accent}-500/5` 
                : 'border-slate-800 bg-slate-900/20 hover:border-slate-700'
              }`}
            >
              <role.icon className={`mb-4 ${role.color}`} size={32} />
              <h3 className="text-lg font-bold mb-2">{role.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{role.desc}</p>
              
              {selectedRole === role.id && (
                <div className={`absolute top-4 right-4 h-3 w-3 rounded-full bg-${role.accent}-500 animate-pulse`} />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto w-full pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input 
                {...register('email', { required: 'E-mail obrigatório' })}
                type="email" 
                placeholder="E-mail profissional" 
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" 
              />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message as string}</span>}
            </div>

            <div>
              <input 
                {...register('password', { required: 'Senha obrigatória', minLength: 6 })}
                type="password" 
                placeholder="Sua melhor senha" 
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" 
              />
              {errors.password && <span className="text-red-500 text-xs mt-1">Mínimo 6 caracteres</span>}
            </div>
            
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-white text-black font-bold p-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Criar minha conta
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem uma mochila? <span onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer hover:underline">Entre aqui</span>
          </p>
        </div>
      </div>
    </div>
  );
};