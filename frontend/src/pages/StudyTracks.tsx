import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle2, Circle, Target, Loader2, X, Trash2, Edit3 } from 'lucide-react';
import api from '../services/api';

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

  const [newTrack, setNewTrack] = useState({ title: '', level: 'Pleno', modules: [''] });

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
    if (!editTitle.trim()) return setEditingModuleId(null);
    try {
      await api.patch(`/study/modules/${moduleId}`, { title: editTitle });
      setEditingModuleId(null);
      fetchTracks();
    } catch (err) { console.error("Erro ao renomear"); }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Remover este tópico de estudo?")) return;
    try {
      await api.delete(`/study/modules/${moduleId}`);
      fetchTracks();
    } catch (err) { console.error("Erro ao deletar"); }
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm("Apagar toda a trilha de evolução?")) return;
    try {
      await api.delete(`/study/tracks/${trackId}`);
      fetchTracks();
    } catch (err) { console.error("Erro ao deletar trilha"); }
  };

  const handleAddQuickModule = async (trackId: string) => {
    const title = prompt("Qual novo sub-tópico você quer dominar?");
    if (!title) return;
    try {
      await api.post(`/study/tracks/${trackId}/modules`, { title });
      fetchTracks();
    } catch (err) { console.error("Erro ao adicionar"); }
  };

  const calculateProgress = (modules: Module[]) => {
    if (!modules?.length) return 0;
    const completed = modules.filter(m => m.isCompleted).length;
    return Math.round((completed / modules.length) * 100);
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Study_Path<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
            Engenharia de conhecimento: Júnior para Pleno
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          <Plus size={16} /> Nova Trilha Personalizada
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tracks.map(track => {
          const progress = calculateProgress(track.modules);
          return (
            <div key={track.id} className="bg-[#0c0c0e] border border-white/5 rounded-[3rem] p-10 hover:border-emerald-500/20 transition-all relative group">
              <button 
                onClick={() => handleDeleteTrack(track.id)}
                className="absolute top-10 right-10 text-zinc-800 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>

              <div className="mb-8">
                <span className="text-[10px] font-mono border border-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full uppercase italic">
                  Level: {track.level}
                </span>
                <h3 className="text-3xl font-black text-white mt-4 italic uppercase tracking-tighter">
                  {track.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xl font-black italic text-emerald-500">{progress}%</span>
              </div>

              <div className="space-y-3">
                {track.modules.map((module) => (
                  <div key={module.id} className="group/item flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04]">
                    <div className="flex items-center gap-4 flex-1">
                      <button onClick={() => handleToggleModule(module.id)}>
                        {module.isCompleted ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle className="text-zinc-700" size={20} />}
                      </button>

                      {editingModuleId === module.id ? (
                        <input 
                          autoFocus
                          className="bg-transparent border-b border-emerald-500 outline-none text-white text-sm w-full"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleRenameModule(module.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRenameModule(module.id)}
                        />
                      ) : (
                        <span className={`text-sm ${module.isCompleted ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>
                          {module.title}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingModuleId(module.id); setEditTitle(module.title); }} className="text-zinc-600 hover:text-white">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDeleteModule(module.id)} className="text-zinc-600 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => handleAddQuickModule(track.id)}
                  className="w-full py-4 border border-dashed border-white/5 rounded-2xl text-[10px] font-mono text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/30 transition-all uppercase flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Inserir Tópico Extra
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* O Modal continua aqui conforme implementado anteriormente */}
    </div>
  );
};