import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, Github, ExternalLink, 
  Layers, Code2, Calendar, LayoutGrid
} from 'lucide-react';
import api from '../services/api';

export const ArchiveProjects = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/profiles/public/${username}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Erro ao carregar arquivo");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (loading || !profile) return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  const archiveProjects = profile.projects.filter((p: any) => {
    const isNotFeatured = !p.isHighlighted;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = selectedTech === 'All' || p.technologies?.includes(selectedTech);

    return isNotFeatured && matchesSearch && matchesTech;
  });
  const allTechs = ['All', ...new Set(profile.projects.flatMap((p: any) => p.technologies || []))];

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-[#020203]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest cursor-pointer ">Retornar</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              
              <p className="text-xs text-zinc-500 uppercase font-mono">@{profile.username}</p>
            </div>
            <img src={profile.avatar} className="w-10 h-10 rounded-lg border border-white/10" alt="" />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
             <Layers className="text-blue-500" size={24} />
             <span className="text-blue-500 font-mono text-xs tracking-[0.5em] uppercase">Inventário_De_Projetos</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-6">
            Projetos
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg">
            Exploração completa de módulos desenvolvidos, arquiteturas de sistema e protótipos experimentais que compõem o ecossistema técnico.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mb-12 items-end justify-between">
          <div className="w-full lg:max-w-md">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {allTechs.map((tech: any) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  selectedTech === tech 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                  : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-200'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
           <LayoutGrid size={14} />
           <span>Exibindo {archiveProjects.length} projetos</span>
           <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archiveProjects.map((project: any) => (
            <div 
              key={project.id}
              className="group bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-4 hover:border-blue-500/30 transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-6">
                <img 
                  src={project.imageUrl || 'https://via.placeholder.com/800x450'} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-4 right-4 flex gap-2">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl hover:bg-blue-600 transition-colors text-white">
                      <Github size={18} />
                    </a>
                  )}
                  {project.deployUrl && (
                    <a href={project.deployUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl hover:bg-blue-600 transition-colors text-white">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              <div className="px-4 pb-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={12} className="text-zinc-600" />
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">
                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 line-clamp-3">
                  {project.description || "No documentation available for this module."}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex flex-wrap gap-2">
                  {project.technologies?.map((tech: string) => (
                    <span key={tech} className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg">
                       <Code2 size={10} className="text-blue-500/50" />
                       {tech.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {archiveProjects.length === 0 && (
          <div className="py-40 text-center border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-[0.4em]">Nenhum dado encontrado neste setor</p>
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.5em]">Sistema de arquivos_v1.0 // {profile.username}</p>
      </footer>
    </div>
  );
};