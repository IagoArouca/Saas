import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Eye, 
  TrendingUp, 
  Plus, 
  Youtube,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import api from '../services/api';

export const CreatorDashboard = () => {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0, // Se você tiver essa integração no futuro
    recentVideos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const res = await api.get('/creators/my-content');
        setStats({
          totalVideos: res.data.length,
          totalViews: 0, 
          recentVideos: res.data.slice(0, 3)
        });
      } catch (err) {
        console.error("Erro ao carregar dados do creator");
      } finally {
        setLoading(false);
      }
    };
    fetchCreatorData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* HEADER DE BOAS-VINDAS */}
      <header>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Content_Control <span className="text-blue-500">.</span>
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] mt-2">
          Central de Comando do Criador
        </p>
      </header>

      {/* CARDS DE ESTATÍSTICAS ROBUSTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <Video className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform" size={120} />
          <p className="text-blue-100 font-mono text-[10px] uppercase tracking-widest mb-2">Vídeos Catalogados</p>
          <h2 className="text-5xl font-black text-white italic">{stats.totalVideos}</h2>
          <div className="mt-4 flex items-center gap-2 text-blue-200 text-xs font-bold">
            <TrendingUp size={14} /> +12% este mês
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all">
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-2">Engajamento Total</p>
          <h2 className="text-5xl font-black text-white italic">--</h2>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <Users size={14} /> Em sincronização...
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all">
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-2">Sessões de Gravação</p>
          <h2 className="text-5xl font-black text-white italic">04</h2>
          <div className="mt-4 flex items-center gap-2 text-zinc-500 text-xs font-bold">
            <Clock size={14} /> Meta: 08/mês
          </div>
        </div>
      </div>

      {/* CONTEÚDO RECENTE E QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Youtube className="text-red-500" /> Uploads Recentes
          </h3>
          <div className="space-y-4">
            {stats.recentVideos.map((video: any) => (
              <div key={video.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                    <Play size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">{video.title}</h4>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase">{new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <ArrowUpRight className="text-zinc-600 group-hover:text-white transition-all" size={20} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600/5 border border-blue-500/10 rounded-[3rem] p-8">
          <h3 className="text-white font-bold mb-6 text-center">Quick_Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all">
              Novo Projeto de Vídeo
            </button>
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-blue-600/20">
              Gerenciar Conteúdo
            </button>
            <div className="pt-6">
              <p className="text-zinc-500 text-[10px] font-mono text-center leading-relaxed">
                "O segredo do sucesso é a consistência no conteúdo."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Play = ({ size, fill }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);