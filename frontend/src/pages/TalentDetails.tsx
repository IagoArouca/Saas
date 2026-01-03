import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recruiterService } from '../services/recruiterService';
import { Github, ExternalLink, MessageSquare, Clock, Trophy, Loader2 } from 'lucide-react';

export const TalentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dev, setDev] = useState<any>(null);

  useEffect(() => {
    if (id) {
      recruiterService.getTalentById(id).then((res: any) => setDev(res.data));
    }
  }, [id]);

  const handleStartChat = () => {
    if (!dev) return;
    // Redireciona para o chat passando o ID e Nome do Dev na URL
    const targetName = dev.profile?.fullName || dev.email;
    navigate(`/dashboard/chat?targetId=${dev.id}&targetName=${encodeURIComponent(targetName)}`);
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
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/40 active:scale-95"
        >
          <MessageSquare size={20} />
          Iniciar Conversa
        </button>
      </div>

      {/* Restante do componente (Projetos e Foco) permanece igual... */}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};