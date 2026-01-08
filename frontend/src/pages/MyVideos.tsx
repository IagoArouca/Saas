import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Youtube, 
  Loader2, 
  AlertCircle,
  Play
} from 'lucide-react';
import api from '../services/api';

interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  createdAt: string;
}

export const MyVideos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newVideo, setNewVideo] = useState({
    title: '',
    videoUrl: '',
    thumbnail: ''
  });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/creators/my-content');
      setVideos(res.data);
    } catch (err) {
      console.error("Erro ao carregar vídeos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/creators/video', newVideo);
      setShowAddModal(false);
      setNewVideo({ title: '', videoUrl: '', thumbnail: '' });
      fetchVideos();
    } catch (err) {
      alert("Erro ao adicionar vídeo. Verifique o link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Deseja realmente remover este conteúdo?")) return;
    try {
      await api.delete(`/creators/video/${id}`);
      setVideos(videos.filter(v => v.id !== id));
    } catch (err) {
      alert("Erro ao excluir vídeo.");
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
            <Video className="text-blue-500" size={32} />
            Conteúdo_De_Vídeo
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2">
            Gerencie suas aulas, tutoriais e palestras
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={20} /> Adicionar Novo
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const ytId = getYouTubeId(video.videoUrl);
            const thumbUrl = video.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '');

            return (
              <div key={video.id} className="group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500">
                <div className="aspect-video relative overflow-hidden">
                  <img src={thumbUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={video.videoUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                      <Play size={24} fill="currentColor" />
                    </a>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg mb-4 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
          <Youtube size={48} className="mx-auto text-zinc-800 mb-4" />
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Nenhum vídeo catalogado</p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="bg-[#0f0f12] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-black italic uppercase text-white mb-6">Novo Conteúdo</h2>
            
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2 px-1">Título do Vídeo</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                  placeholder="Ex: Dominando NestJS em 10 min"
                  value={newVideo.title}
                  onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2 px-1">URL do Youtube</label>
                <input 
                  required
                  type="url"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                  placeholder="https://youtube.com/watch?v=..."
                  value={newVideo.videoUrl}
                  onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 rounded-xl font-bold text-zinc-400 hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] bg-blue-600 py-4 rounded-xl font-bold text-white hover:bg-blue-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Publicar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};