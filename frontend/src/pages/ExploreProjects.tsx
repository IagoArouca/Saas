import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Code, ExternalLink, Loader2, User, Cpu } from 'lucide-react';
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">Explorar_Sistemas</h1>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] mt-2">Protocolos de rede descobertos na infraestrutura</p>
      </header>

      {/* Barra de Busca Estilizada */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex gap-4 items-center backdrop-blur-md">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Filtrar frequência de tecnologia (ex: React, AWS)..."
            className="w-full bg-slate-950 border border-slate-800 p-3 pl-12 rounded-lg focus:border-emerald-500/50 outline-none transition-all text-sm font-mono text-emerald-500 placeholder:text-slate-700"
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
          />
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-slate-500 border border-slate-700/50">
          <Filter size={20} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <span className="text-xs font-mono text-emerald-500/50 animate-pulse uppercase tracking-[0.2em]">Sincronizando Banco de Dados...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? projects.map((proj: any) => (
            /* CARD DE EXPLORAÇÃO: ESTILO DOSSIÊ */
            <div key={proj.id} className="group relative bg-[#0a0f1a] border border-slate-800 rounded-xl p-1 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] flex flex-col">
              
              {/* Header do Card (Identificador) */}
              <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-t-lg border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest uppercase">ID: {proj.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  <User size={10} className="text-emerald-500" />
                  <span className="text-[9px] font-mono text-emerald-500 font-black">@{proj.user?.profile?.username}</span>
                </div>
              </div>

              {/* Body do Card */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={14} className="text-slate-600" />
                  <h3 className="font-black text-lg text-slate-100 group-hover:text-emerald-400 transition-colors tracking-tight uppercase italic truncate">
                    {proj.title}
                  </h3>
                </div>

                <div className="relative mb-6">
                   <div className="absolute -left-2 top-0 bottom-0 w-[2px] bg-emerald-500/20" />
                   <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 font-medium italic pl-3">
                    {proj.description || "Sem metadados descritivos no sistema."}
                  </p>
                </div>

                {/* Tags de Tecnologia (Estilo Console) */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {proj.technologies.slice(0, 4).map((t: string) => (
                    <span key={t} className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono uppercase">
                      {t}
                    </span>
                  ))}
                  {proj.technologies.length > 4 && (
                    <span className="text-[9px] text-slate-600 font-mono">+{proj.technologies.length - 4}</span>
                  )}
                </div>
              </div>

              {/* Botão de Ação Estilo Scan */}
              <div className="p-3 pt-0">
                <button 
                  onClick={() => navigate(`/p/${proj.user?.profile?.username}`)}
                  className="w-full py-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-2 border border-emerald-500/20 uppercase tracking-[0.2em] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  Acessar Perfil <ExternalLink size={12} />
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-24 border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
              <Code size={40} className="mx-auto text-slate-800 mb-4" />
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Zero correspondências encontradas.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};