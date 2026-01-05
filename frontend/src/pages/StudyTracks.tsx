import React, { useEffect, useState } from 'react';
import { 
  Plus, CheckCircle2, Circle, Target, Loader2, 
  Trash2, Edit3, Rocket, ChevronRight, Zap, X 
} from 'lucide-react';
import api from '../services/api';
import { useFocus } from '../contexts/FocusContext';

interface Module {
  id: string;
  title: string;
  isCompleted: boolean;
  order: number;
}

interface Track {
  id: string;
  title: string;
  level: string;
  modules: Module[];
}

export const StudyTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [newTrack, setNewTrack] = useState({ title: '', level: 'Pleno' });

  const { isActive, formatTime, timeLeft } = useFocus();

  const fetchTracks = async () => {
    try {
      const res = await api.get('/study/tracks');
      setTracks(res.data);
    } catch (err) {
      console.error("Erro ao carregar trilhas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTracks(); }, []);

  const handleToggleModule = async (moduleId: string) => {
    try {
      await api.patch(`/study/modules/${moduleId}/toggle`);
      fetchTracks();
    } catch (err) { console.error("Erro ao alternar status"); }
  };

  const handleRenameModule = async (moduleId: string) => {
    if (!editTitle.trim()) {
      setEditingModuleId(null);
      return;
    }
    try {
      await api.patch(`/study/modules/${moduleId}`, { title: editTitle });
      setEditingModuleId(null);
      fetchTracks();
    } catch (err) {
      console.error("Erro ao renomear");
    }
  };

  const handleCreateTrack = async () => {
    if (!newTrack.title) return;
    try {
      await api.post('/study/tracks', { 
        ...newTrack, 
        modules: ["Arquitetura de Sistemas", "Padrões de Projeto"] 
      });
      setIsModalOpen(false);
      setNewTrack({ title: '', level: 'Pleno' });
      fetchTracks();
    } catch (err) { console.error("Erro ao criar trilha"); }
  };

  const calculateProgress = (modules: Module[]) => {
    if (!modules?.length) return 0;
    const completed = modules.filter(m => m.isCompleted).length;
    return Math.round((completed / modules.length) * 100);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#050505]">
      <Loader2 className="animate-spin text-emerald-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-12 pb-32">
      
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-emerald-500 font-mono text-[10px] tracking-[0.5em] uppercase">
            <Zap size={14} fill="currentColor" /> Sistema evolutivo
          </div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
            Trilha <span className="text-emerald-500">de </span>Estudo
          </h1>
          <p className="text-zinc-500 max-w-md text-sm leading-relaxed">
            Mapeie sua jornada de engenharia. Transforme conhecimento em progresso real.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex bg-white/[0.03] border border-white/10 p-4 rounded-3xl items-center gap-4 backdrop-blur-md">
            <div className={`p-3 rounded-2xl ${isActive ? 'bg-orange-500/20 text-orange-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
              <Rocket size={20} className={isActive ? 'animate-bounce' : ''} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Status de Foco</p>
              <p className="text-white font-black">{isActive ? `EM FOCO: ${formatTime(timeLeft)}` : 'SESSÃO PRONTA'}</p>
            </div>
          </div>
          
          {/* BOTÃO DE NOVA TRILHA - REFINADO E REFLEXIVO */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer group relative px-8 py-3.5 bg-emerald-500 rounded-xl font-black uppercase text-[11px] tracking-[0.15em] text-black transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 overflow-hidden border border-emerald-400/50"
          >
            {/* Efeito Reflexivo (Glint) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>
            
            {/* Borda de luz superior */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/40" />
            
            <span className="relative flex items-center gap-2.5">
              <Plus size={16} strokeWidth={4} />
              Criar
            </span>
          </button>
        </div>
      </header>

      {/* GRID DE TRILHAS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {tracks.map(track => {
          const progress = calculateProgress(track.modules);
          const levelColor = track.level === 'Júnior' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
          const barColor = track.level === 'Júnior' ? 'from-blue-600 to-blue-400 shadow-blue-500/30' : 'from-emerald-600 to-emerald-400 shadow-emerald-500/30';

          return (
            <div key={track.id} className="relative bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-1 shadow-2xl group transition-all hover:border-white/10">
              <div className="p-8 md:p-10 space-y-8">
                
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <span className={`inline-flex items-center gap-2 text-[10px] font-mono px-4 py-1.5 rounded-full border ${levelColor}`}>
                      <Target size={12} /> {track.level.toUpperCase()}
                    </span>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">
                      {track.title}
                    </h2>
                  </div>
                  <button 
                    onClick={() => api.delete(`/study/tracks/${track.id}`).then(fetchTracks)}
                    className="cursor-pointer p-3 text-zinc-700 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System_Progress</span>
                    <span className={`text-3xl font-black italic ${track.level === 'Júnior' ? 'text-blue-400' : 'text-emerald-500'}`}>{progress}%</span>
                  </div>
                  <div className="h-5 bg-white/5 rounded-2xl overflow-hidden p-1 border border-white/5">
                    <div 
                      className={`h-full bg-gradient-to-r ${barColor} rounded-xl transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.2)]`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* MODULES */}
                <div className="space-y-3 pt-4">
                  {track.modules.map((module) => (
                    <div key={module.id} className="group/item flex items-center justify-between p-5 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all hover:translate-x-1">
                      <div className="flex items-center gap-5 flex-1">
                        <button onClick={() => handleToggleModule(module.id)} className="cursor-pointer transition-transform active:scale-75">
                          {module.isCompleted ? 
                            <CheckCircle2 className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" size={24} /> : 
                            <Circle className="text-zinc-800 group-hover/item:text-zinc-600" size={24} />
                          }
                        </button>

                        {editingModuleId === module.id ? (
                          <input 
                            autoFocus
                            className="bg-zinc-800/50 border border-emerald-500/50 rounded-lg px-3 outline-none text-white text-sm w-full py-1.5 font-bold"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleRenameModule(module.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameModule(module.id)}
                          />
                        ) : (
                          <span className={`text-sm font-bold tracking-tight ${module.isCompleted ? 'text-zinc-600 line-through' : 'text-zinc-300 group-hover/item:text-white'}`}>
                            {module.title}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                        <button onClick={() => { setEditingModuleId(module.id); setEditTitle(module.title); }} className="cursor-pointer p-2 text-zinc-500 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-colors">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => api.delete(`/study/modules/${module.id}`).then(fetchTracks)} className="cursor-pointer p-2 text-zinc-500 hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => {
                      const title = prompt("Defina o novo objetivo:");
                      if(title) api.post(`/study/tracks/${track.id}/modules`, { title }).then(fetchTracks);
                    }}
                    className="cursor-pointer w-full mt-4 py-4 rounded-2xl border border-dashed border-white/10 text-zinc-500 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-widest"
                  >
                    <Plus size={16} /> Adicionar Módulo de Estudo
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CRIAR TRILHA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <button onClick={() => setIsModalOpen(false)} className="cursor-pointer absolute top-8 right-8 text-zinc-500 hover:text-white">
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 italic">Novo_Roadmap</h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Nome</label>
                <input 
                  autoFocus
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-white outline-none  focus:bg-white/[0.05] transition-all font-bold text-lg"
                  placeholder="Ex: Engenharia de Performance"
                  value={newTrack.title}
                  onChange={(e) => setNewTrack({...newTrack, title: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Júnior', 'Pleno', 'Sênior'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setNewTrack({...newTrack, level: lvl})}
                      className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        newTrack.level === lvl ? 
                        'bg-emerald-500 border-emerald-500 text-black' : 
                        'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCreateTrack}
                className="cursor-pointer w-full bg-white text-black font-black uppercase py-6 rounded-2xl hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all text-[12px] tracking-[0.2em] shadow-xl"
              >
                Confirmar Inicialização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};