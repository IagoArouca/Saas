import { useState } from 'react';
import { Code2, Briefcase, MonitorPlay, ChevronRight } from 'lucide-react';

const roles = [
  {
    id: 'DEV',
    title: 'Desenvolvedor',
    desc: 'Organize seus estudos, projetos e seja visto por recrutadores.',
    icon: Code2,
    color: 'text-blue-500',
    border: 'hover:border-blue-500',
    bg: 'bg-blue-500/5'
  },
  {
    id: 'RECRUITER',
    title: 'Recrutador',
    desc: 'Encontre os melhores talentos e gerencie suas contratações.',
    icon: Briefcase,
    color: 'text-emerald-500',
    border: 'hover:border-emerald-500',
    bg: 'bg-emerald-500/5'
  },
  {
    id: 'CONTENT_CREATOR',
    title: 'Criador',
    desc: 'Compartilhe conhecimento e direcione tráfego para seu canal.',
    icon: MonitorPlay,
    color: 'text-purple-500',
    border: 'hover:border-purple-500',
    bg: 'bg-purple-500/5'
  }
];

export const Register = () => {
  const [selectedRole, setSelectedRole] = useState('DEV');

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Crie sua conta</h1>
          <p className="text-slate-400 mt-2">Escolha como você quer utilizar a Mochila do Dev</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedRole === role.id 
                ? `border-${role.color.split('-')[1]}-500 ${role.bg}` 
                : 'border-slate-800 bg-slate-900/20 hover:border-slate-700'
              }`}
            >
              <role.icon className={`mb-4 ${role.color}`} size={32} />
              <h3 className="text-lg font-bold mb-2">{role.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{role.desc}</p>
              
              {selectedRole === role.id && (
                <div className="absolute top-4 right-4">
                  <div className={`h-3 w-3 rounded-full bg-${role.color.split('-')[1]}-500 animate-pulse`} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto w-full space-y-4 pt-4">
          <input type="email" placeholder="E-mail profissional" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 outline-none" />
          <input type="password" placeholder="Senha segura" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-blue-500 outline-none" />
          
          <button className="w-full bg-white text-black font-bold p-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group">
            Começar minha jornada
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};