import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Settings = () => {
  const { register, handleSubmit, reset } = useForm();

  const onUpdateProfile = async (data: any) => {
    try {
      await api.put('/profiles/update', data);
      alert('Perfil atualizado com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>
      
      <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6 bg-slate-900/30 p-8 rounded-3xl border border-slate-800">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">Username Público</label>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-slate-600">mochiladev.com/p/</span>
            <input 
              {...register('username')}
              className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded-lg focus:border-blue-500 outline-none"
              placeholder="seu-nome"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">Biografia</label>
          <textarea 
            {...register('bio')}
            rows={4}
            className="w-full mt-2 bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 outline-none"
            placeholder="Conte um pouco sobre sua jornada..."
          />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 w-full p-4 rounded-xl font-bold transition-all">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};