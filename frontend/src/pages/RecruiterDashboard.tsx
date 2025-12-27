import { useEffect, useState } from 'react';
import { recruiterService } from '../services/recruiterService';

import { Search, MapPin, ExternalLink, MessageSquare, Code2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecruiterDashboard = () => {
  const [talents, setTalents] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    recruiterService.getTalents().then((res: any) => setTalents(res.data));
  }, []);

  const filteredTalents = talents.filter((dev: any) => {
    const search = searchTerm.toLowerCase();
    const techMatch = dev.profile?.technologies?.some((t: string) => t.toLowerCase().includes(search));
    const nameMatch = dev.profile?.fullName?.toLowerCase().includes(search);
    return techMatch || nameMatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold italic">Explorar <span className="text-emerald-500">Talentos</span></h1>
          <p className="text-slate-400">Conecte-se com desenvolvedores prontos para o mercado.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Nome ou tecnologia..."
            className="w-full bg-slate-900 border border-slate-800 p-3 pl-10 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTalents.map((dev: any) => (
          <div key={dev.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden">

            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-all" />

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-500 p-[1.5px] shadow-lg shadow-emerald-500/10">
                <div className="h-full w-full rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden">
                  {dev.profile?.avatar ? (
                    <img src={dev.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Code2 className="text-slate-700" size={24} />
                  )}
                </div>
              </div>
              <button 
                onClick={() => navigate('/dashboard/chat')}
                className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
              >
                <MessageSquare size={20} />
              </button>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                {dev.profile?.fullName || 'Desenvolvedor'}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin size={12} /> Remote / Brasil
              </p>
            </div>

            <p className="text-slate-400 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
              {dev.profile?.bio || 'Membro da Mochila.dev focado em constante evolução tecnológica.'}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {dev.profile?.technologies?.slice(0, 3).map((tech: string) => (
                <span key={tech} className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/50">
                  {tech}
                </span>
              ))}
              {dev.profile?.technologies?.length > 3 && (
                <span className="text-[10px] text-slate-500 font-bold py-1">
                  +{dev.profile.technologies.length - 3}
                </span>
              )}
            </div>

            <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Briefcase size={14} className="text-emerald-500/70" /> {dev.projects?.length || 0} Projetos
              </span>
              <button 
                onClick={() => navigate(`/p/${dev.username}`)}
                className="text-xs font-bold uppercase tracking-tighter text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                Portfólio <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};