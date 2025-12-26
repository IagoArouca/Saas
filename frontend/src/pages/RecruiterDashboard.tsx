import { useEffect, useState } from 'react';
import { recruiterService } from '../services/recruiterService';
import { Search, MapPin, ExternalLink, MessageSquare } from 'lucide-react';

export const RecruiterDashboard = () => {
  const [talents, setTalents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    recruiterService.getTalents().then(res => setTalents(res.data));
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Explorar Talentos</h1>
          <p className="text-slate-400">Conecte-se com desenvolvedores prontos para o mercado.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Filtrar por tecnologia..."
            className="w-full bg-slate-900 border border-slate-800 p-2 pl-10 rounded-xl outline-none focus:border-emerald-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {talents.map((dev: any) => (
          <div key={dev.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[2px]">
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  {dev.profile?.avatar ? <img src={dev.profile.avatar} alt="Avatar" /> : <Code2 className="text-slate-700" />}
                </div>
              </div>
              <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                <MessageSquare size={18} />
              </button>
            </div>

            <h3 className="font-bold text-lg">{dev.profile?.fullName || 'Desenvolvedor Anônimo'}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{dev.profile?.bio || 'Sem biografia disponível.'}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {dev.profile?.technologies?.map((tech: string) => (
                <span key={tech} className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded-md">
                  {tech}
                </span>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Briefcase size={14} /> {dev.projects?.length || 0} Projetos
              </span>
              <button className="text-sm font-semibold text-emerald-500 hover:underline flex items-center gap-1">
                Ver Perfil <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};