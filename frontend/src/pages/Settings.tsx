import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useEffect, useState } from 'react';
import { Loader2, Save, User, Globe } from 'lucide-react';

export const Settings = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const res = await api.get('/profiles/me');
        reset(res.data); 
      } catch (err) {
        console.error("Erro ao carregar dados do perfil");
      } finally {
        setFetching(false);
      }
    };
    loadProfileData();
  }, [reset]);

  const onUpdateProfile = async (data: any) => {
    setLoading(true);
    try {
      await api.put('/profiles/update', data);
      alert('Perfil atualizado com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="text-blue-500" /> Configurações
        </h1>
        <p className="text-slate-400 mt-2">Gerencie suas informações públicas e identidade na plataforma.</p>
      </header>
      
      <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6 bg-slate-900/30 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Globe size={14} /> Username Público
          </label>
          <div className="flex items-center gap-2 mt-2 bg-slate-950 border border-slate-800 p-1 rounded-xl focus-within:border-blue-500 transition-all">
            <span className="pl-3 text-slate-600 text-sm font-mono select-none">mochila.dev/p/</span>
            <input 
              {...register('username')}
              className="flex-1 bg-transparent p-2 rounded-lg outline-none text-white text-sm"
              placeholder="seu-nome"
              required
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-2 ml-1 italic">Esse será o link do seu portfólio.</p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Biografia</label>
          <textarea 
            {...register('bio')}
            rows={4}
            className="w-full mt-2 bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-blue-500 outline-none text-white transition-all resize-none text-sm leading-relaxed"
            placeholder="Conte um pouco sobre sua jornada, tecnologias favoritas e o que você está construindo..."
          />
        </div>

        <button 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Salvar Alterações</>}
        </button>
      </form>
    </div>
  );
};