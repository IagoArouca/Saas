import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recruiterService } from '../services/recruiterService';
import { User, MessageSquare, ArrowRight, Loader2, Sparkles, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TalentHub = () => {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    recruiterService.getTalents()
      .then((res: any) => setTalents(res.data))
      .catch((err: any) => console.error("Erro ao buscar talentos:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-500" size={48} />
      <p className="text-slate-500 font-medium animate-pulse">Curando os melhores talentos...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-16 relative">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
              Recruitment Hub
            </span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            Encontre seu próximo <br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Talento Tech.
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
            Conecte-se com desenvolvedores verificados, analise portfólios e inicie conversas em tempo real.
          </p>
        </div>
      </header>

      {talents.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-slate-900/20 border border-slate-800 border-dashed rounded-[3rem] p-20 text-center"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="text-slate-600" size={32} />
          </div>
          <p className="text-slate-500 text-lg">Nenhum desenvolvedor disponível no radar hoje.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {talents.map((dev: any, idx: number) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={dev.id}
                className="group relative bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 hover:bg-slate-900/60 hover:border-slate-700 hover:shadow-2xl transition-all backdrop-blur-md flex flex-col"
              >
                <div className="absolute top-6 right-6">
                   <div className="flex items-center gap-1.5 bg-slate-950/50 border border-slate-800 px-3 py-1.5 rounded-full">
                      <Briefcase size={12} className="text-emerald-400" />
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                        {dev.projects?.length || 0} Projetos
                      </span>
                   </div>
                </div>
                <div className="flex flex-col items-start gap-4 mb-8 mt-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-slate-700 to-slate-800 p-[1px] group-hover:from-blue-500 group-hover:to-emerald-500 transition-all duration-500 shadow-xl">
                      <div className="w-full h-full rounded-[2rem] bg-slate-900 overflow-hidden">
                        {dev.profile?.avatar ? (
                          <img src={dev.profile.avatar} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="Avatar" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                            <User size={36} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-full" />
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold text-xl tracking-tight group-hover:text-blue-400 transition-colors">
                      {dev.profile?.fullName || dev.username || 'Anonymous Dev'}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-400" />
                      {dev.profile?.level || 'Software Engineer'}
                    </p>
                  </div>
                </div>
                <div className="relative mb-8">
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 h-[4.5rem]">
                    {dev.profile?.bio ? `"${dev.profile.bio}"` : 'Este talento prefere deixar o código falar por si só.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-10">
                  {dev.profile?.technologies?.slice(0, 4).map((tech: string) => (
                    <span key={tech} className="bg-slate-950 text-slate-400 text-[10px] px-3 py-1.5 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors font-semibold uppercase tracking-wider">
                      {tech}
                    </span>
                  ))}
                  {dev.profile?.technologies?.length > 4 && (
                    <span className="text-[10px] text-slate-500 py-1.5">+ mais</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <button 
                    onClick={() => {
                      const username = dev.username || dev.profile?.username;
                      if (username) {
                        navigate(`/p/${username}`);
                      }
                    }}
                    className="flex-[2] cursor-pointer bg-white text-slate-950 hover:bg-slate-200 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    ANALISAR PERFIL <ArrowRight size={14} />
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/dashboard/chat?targetId=${dev.id}`)}
                    className="flex-1 bg-slate-800/50 hover:bg-slate-800 cursor-pointer text-white p-3.5 rounded-2xl transition-all border border-slate-700 active:scale-95 flex items-center justify-center group/btn"
                  >
                    <MessageSquare size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};