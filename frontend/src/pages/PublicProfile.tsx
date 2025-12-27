import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Github, ExternalLink, Globe, Code2, Trophy, Clock } from 'lucide-react';
import api from '../services/api';

export const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/public/${username}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Perfil não encontrado");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white font-mono">Carregando mochila...</div>;
  if (!profile) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">Perfil não encontrado.</div>;

  return (
    <>
      <Helmet>
        <title>{`${profile.fullName || profile.username} | Mochila do Dev`}</title>
        <meta name="description" content={profile.bio} />
        <meta property="og:title" content={`${profile.fullName} - Portfólio na Mochila do Dev`} />
        <meta property="og:image" content={profile.avatar} />
      </Helmet>

      <div className="min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30">
        <div className="h-48 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-slate-800" />

        <main className="max-w-5xl mx-auto px-6 -mt-20 pb-20">
          <div className="flex flex-col items-center md:items-end md:flex-row gap-6 mb-12">
            <div className="relative">
              <img 
                src={profile.avatar || 'https://via.placeholder.com/150'} 
                alt={profile.fullName} 
                className="w-40 h-40 rounded-3xl border-4 border-[#09090b] bg-slate-900 object-cover shadow-2xl"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tight">{profile.fullName}</h1>
              <p className="text-blue-400 font-medium">@{profile.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-10">
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Sobre mim</h2>
                <p className="text-lg text-slate-300 leading-relaxed">{profile.bio}</p>
              </section>

              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <Trophy size={16} /> Projetos em Destaque
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects?.map((proj: any) => (
                    <div key={proj.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl group hover:border-blue-500/50 transition-all">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-blue-400">{proj.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">{proj.description}</p>
                      <div className="flex gap-4">
                        <a href={proj.githubUrl} target="_blank" className="text-slate-500 hover:text-white"><Github size={20}/></a>
                        <a href={proj.deployUrl} target="_blank" className="text-slate-500 hover:text-white"><Globe size={20}/></a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Coluna Direita: Skills e Stats */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.technologies?.map((tech: string) => (
                    <span key={tech} className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold border border-blue-500/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 p-6 rounded-3xl">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                  <Clock size={14} /> Foco & Disciplina
                </h3>
                <p className="text-3xl font-black text-white">42h</p>
                <p className="text-xs text-slate-500 mt-1 text-balance">Tempo dedicado ao aprimoramento técnico nesta plataforma.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};