// src/pages/TalentDetails.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { recruiterService } from '../services/recruiterService';
import { chatService } from '../services/chatService'; 
import { Code2, Github, ExternalLink, MessageSquare, Clock, Trophy } from 'lucide-react';

export const TalentDetails = () => {
  const { id } = useParams();
  const [dev, setDev] = useState<any>(null);

  useEffect(() => {
    recruiterService.getTalentById(id!).then(res => setDev(res.data));
  }, [id]);

  if (!dev) return <div className="text-white">Carregando perfil...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 p-1">
          <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
             <img src={dev.profile?.avatar || 'https://via.placeholder.com/150'} alt="Avatar" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">{dev.profile?.fullName || 'Dev Extraordinário'}</h1>
          <p className="text-blue-400 font-medium mb-4">{dev.profile?.seniority || 'Junior'} Full Stack Developer</p>
          <p className="text-slate-400 max-w-2xl">{dev.profile?.bio}</p>
        </div>

        <button 
          onClick={() => {/* Lógica para abrir chat */}}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
        >
          <MessageSquare size={20} /> Iniciar Conversa
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" size={22} /> Projetos em Destaque
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {dev.projects?.map((project: any) => (
              <div key={project.id} className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <div className="flex gap-3 text-slate-500">
                    <a href={project.githubUrl}><Github size={18} /></a>
                    <a href={project.deployUrl}><ExternalLink size={18} /></a>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4">{project.description}</p>
                <div className="flex gap-2">
                  {project.technologies?.map((t: string) => (
                    <span key={t} className="text-[10px] bg-slate-800 px-2 py-1 rounded-md">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 space-y-6">
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-blue-400"/> Foco e Disciplina</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Sessões de Pomodoro</span>
                <span className="font-mono text-blue-400">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Horas de Estudo</span>
                <span className="font-mono text-blue-400">18h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};