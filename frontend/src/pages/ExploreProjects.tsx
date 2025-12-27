import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Code, ExternalLink, Loader2 } from 'lucide-react';
import api from '../services/api';

export const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);
  const [techFilter, setTechFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchExplore = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/explore`, {
        params: { tech: techFilter }
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExplore();
    }, 500); 
    return () => clearTimeout(timeoutId);
  }, [techFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Explorar Projetos</h1>
        <p className="text-slate-400 mt-2">Descubra soluções técnicas e os talentos por trás delas.</p>
      </header>

      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex gap-4 items-center backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Filtrar por tecnologia (ex: React, Prisma, AWS)..."
            className="w-full bg-slate-950 border border-slate-800 p-3 pl-12 rounded-xl focus:border-emerald-500 outline-none transition-all text-sm"
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
          />
        </div>
        <div className="bg-slate-800 p-3 rounded-xl text-slate-400">
          <Filter size={20} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? projects.map((proj: any) => (
            <div key={proj.id} className="bg-slate-900/20 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-all flex flex-col group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                  <Code className="text-emerald-500" size={20} />
                </div>
                <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-400 font-mono tracking-tighter">
                  @{proj.user?.profile?.username}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">{proj.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-6 flex-1 leading-relaxed">{proj.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {proj.technologies.slice(0, 3).map((t: string) => (
                  <span key={t} className="text-[9px] bg-slate-800/50 text-slate-400 px-2 py-0.5 rounded border border-slate-700/50 uppercase">
                    {t}
                  </span>
                ))}
                {proj.technologies.length > 3 && <span className="text-[9px] text-slate-600">+{proj.technologies.length - 3}</span>}
              </div>

              <button 
                onClick={() => navigate(`/p/${proj.user?.profile?.username}`)}
                className="w-full py-2.5 bg-slate-800 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Ver Perfil <ExternalLink size={14} />
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500 italic">Nenhum projeto encontrado com essa tecnologia.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};