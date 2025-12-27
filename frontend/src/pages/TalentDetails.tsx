import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recruiterService } from '../services/recruiterService';
import { chatService } from '../services/chatService'; 
import { Github, ExternalLink, MessageSquare, Clock, Trophy, Loader2 } from 'lucide-react';

export const TalentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dev, setDev] = useState<any>(null);
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    if (id) {
      recruiterService.getTalentById(id).then((res: any) => setDev(res.data));
    }
  }, [id]);

  const handleStartChat = async () => {
    setLoadingChat(true);
    try {
      const res = await chatService.getOrCreateConversation(dev.id);
      navigate(`/dashboard/chat?id=${res.data.id}`);
    } catch (err) {
      alert("Não foi possível iniciar a conversa.");
    } finally {
      setLoadingChat(false);
    }
  };

  if (!dev) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center backdrop-blur-md">
        <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-blue-500 to-emerald-500 p-1 shadow-2xl">
          <div className="h-full w-full rounded-3xl bg-slate-950 flex items-center justify-center overflow-hidden">
             <img 
               src={dev.profile?.avatar || 'https://via.placeholder.com/150'} 
               alt="Avatar" 
               className="w-full h-full object-cover"
             />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-black text-white">{dev.profile?.fullName || 'Dev Extraordinário'}</h1>
          <p className="text-emerald-400 font-bold mb-4 uppercase text-xs tracking-widest">
            {dev.profile?.seniority || 'Junior'} Full Stack Developer
          </p>
          <p className="text-slate-400 max-w-2xl leading-relaxed">{dev.profile?.bio || 'Sem biografia disponível.'}</p>
        </div>

        <button 
          onClick={handleStartChat}
          disabled={loadingChat}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/40 active:scale-95"
        >
          {loadingChat ? <Loader2 className="animate-spin" size={20} /> : <MessageSquare size={20} />}
          Iniciar Conversa
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-amber-500" size={22} /> Projetos em Destaque
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {dev.projects?.map((project: any) => (
              <div key={project.id} className="group bg-slate-900/30 border border-slate-800 p-6 rounded-3xl hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <div className="flex gap-4">
                    <a href={project.githubUrl} target="_blank" className="text-slate-500 hover:text-white transition-colors"><Github size={20} /></a>
                    <a href={project.deployUrl} target="_blank" className="text-slate-500 hover:text-white transition-colors"><ExternalLink size={20} /></a>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((t: string) => (
                    <span key={t} className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-[2rem]">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Clock size={18} className="text-blue-400"/> Foco e Disciplina
            </h3>
            <div className="space-y-6">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Sessões Pomodoro</p>
                <p className="font-mono text-3xl text-white">42</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Horas de Estudo</p>
                <p className="font-mono text-3xl text-blue-400">18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};