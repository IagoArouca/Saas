import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Github, 
  ExternalLink, 
  Mail, 
  MessageSquare,
  Code2,
  Loader2,
  Plus,
  ShieldCheck,
  Terminal,
  Linkedin
} from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const SectionWrapper = ({ id, children, index, setActiveSection }: any) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveSection(index);
      },
      { threshold: 0.5 }
    );
    const element = document.getElementById(id);
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [id, index, setActiveSection]);

  return (
    <section 
      id={id} 
      className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-20 overflow-hidden border-b border-white/5 bg-[#020203]"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-emerald-500/5" />
      </div>
      <div className="relative z-10 w-full max-w-7xl">{children}</div>
    </section>
  );
};

export const PublicProfile = () => {
  const { username: urlUsername } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        if (urlUsername) {
          await api.post(`/profiles/public/${urlUsername}/visit`);
        }
      } catch (err) {
        console.error("Erro ao registrar visita");
      }
    };
    recordVisit();
  }, [urlUsername]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      let targetUsername = urlUsername;
      if (!targetUsername) {
        if (user?.username) targetUsername = user.username;
        else {
          const resMe = await api.get('/profiles/me');
          targetUsername = resMe.data.username;
        }
      }
      if (targetUsername) {
        const res = await api.get(`/profiles/public/${targetUsername}`);
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [urlUsername, user?.username]);

  const handleStartChat = () => {
    if (!profile) return;
    const targetId = profile.userId || profile.id; 
    const targetName = profile.fullName || profile.username;
    navigate(`/dashboard/chat?targetId=${targetId}&targetName=${encodeURIComponent(targetName)}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center text-white">
      <p className="font-mono text-xs tracking-widest uppercase opacity-50">Profile_Not_Found</p>
    </div>
  );

  const featuredProjects = profile.projects?.filter((p: any) => p.isHighlighted) || [];
  const hasArchive = (profile.projects?.length || 0) > featuredProjects.length;

  const sections = [
    { id: 'briefing'},
    { id: 'stack'},
    ...featuredProjects.map((_: any, i: number) => ({ id: `project-${i}` })),
    { id: 'contact'}
  ];

  return (
    <>
      <Helmet>
        <title>{`${profile.fullName || profile.username} | Dev_Dossier`}</title>
      </Helmet>

      {/* Navegação Lateral */}
      <nav className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-8">
        {sections.map((sec, i) => (
          <button
            key={sec.id}
            onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative flex items-center justify-end"
          >
            <span className={`absolute right-8 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-300 pointer-events-none ${
              activeSection === i ? 'text-blue-500 opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-100'
            }`}>
              {sec.label}
            </span>
            <div className={`transition-all duration-500 rounded-full ${
              activeSection === i ? 'w-10 h-1 bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'w-3 h-1 bg-white/10 group-hover:bg-white/40'
            }`} />
          </button>
        ))}
      </nav>

      <div className="min-h-screen bg-[#020203] text-white selection:bg-blue-500/30 font-sans">
        
        {/* Hero Header */}
        <header className="relative h-[35rem] w-full overflow-hidden border-b border-white/5">
          {profile.bannerUrl ? (
            <img src={profile.bannerUrl} className="w-full h-full object-cover opacity-40" alt="" />
          ) : (
            <div className="absolute inset-0 bg-[#0a0a0c] opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent" />
          
          <div className="absolute bottom-10 left-0 w-full px-6 md:px-20">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <img 
                src={profile.avatar || 'https://via.placeholder.com/150'} 
                className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] border-4 border-[#020203] object-cover shadow-2xl" 
                alt="Avatar" 
              />
              <div className="text-center md:text-left">
                <div className="flex justify-center md:justify-start gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider text-blue-400">
                    {profile.role || 'Developer'}
                  </span>
                  {profile.level && (
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <ShieldCheck size={10} className="text-blue-500" />
                      {profile.level}
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-2">
                  {profile.fullName || profile.username}
                </h1>
                <p className="text-blue-500 font-mono text-xs tracking-widest uppercase">@{profile.username}</p>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Bio Section */}
          <SectionWrapper id="briefing" index={0} setActiveSection={setActiveSection}>
            <div className="max-w-4xl">
              <h2 className="text-blue-500 font-mono tracking-[0.5em] uppercase text-xs mb-8 flex items-center gap-2">
                <Terminal size={14} /> Especialista
              </h2>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-10 text-white">
                {(profile.role || "Dev").replace(/\s+/g, '_')}
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            </div>
          </SectionWrapper>

          {/* Tech Stack Section */}
          <SectionWrapper id="stack" index={1} setActiveSection={setActiveSection}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <h2 className="text-blue-500 font-mono tracking-[0.5em] uppercase text-xs mb-6">Expertise</h2>
                <h3 className="text-5xl font-black italic uppercase tracking-tighter text-white">Tecnologias</h3>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {profile.technologies?.map((tech: string) => (
                  <div key={tech} className="p-6 bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                    <Code2 className="text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
                    <span className="font-mono text-sm uppercase tracking-widest text-zinc-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          {/* Featured Projects */}
          {featuredProjects.map((project: any, i: number) => (
            <SectionWrapper key={project.id} id={`project-${i}`} index={i + 2} setActiveSection={setActiveSection}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <span className="text-blue-500 font-mono text-[10px] tracking-[0.5em]">Projeto{i+1} </span>
                  <h3 className="text-6xl font-black italic uppercase tracking-tighter mt-4 mb-8">{project.title}</h3>
                  <p className="text-zinc-400 text-lg mb-6 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-10">
                    {project.technologies?.map((t: string) => (
                      <span key={t} className="px-4 py-1 border border-white/10 text-[10px] font-mono uppercase text-zinc-500">{t}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:text-blue-500 transition-all">
                        <Github size={14} /> <span>Deploy</span>
                        <div className="h-px w-8 bg-white/20 group-hover:w-16 group-hover:bg-blue-500 transition-all" />
                      </a>
                    )}
                    {project.deployUrl && (
                      <a href={project.deployUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:text-emerald-500 transition-all">
                        <ExternalLink size={14} /> <span>Live_Deploy</span>
                        <div className="h-px w-8 bg-white/20 group-hover:w-16 group-hover:bg-emerald-500 transition-all" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="order-1 lg:order-2 aspect-video bg-zinc-900 border border-white/10 relative overflow-hidden group rounded-2xl shadow-2xl">
                  <img src={project.imageUrl || 'https://via.placeholder.com/800x450'} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
              </div>
            </SectionWrapper>
          ))}

          {/* Archive Link */}
          <div className="py-32 flex flex-col items-center justify-center border-t border-white/5 bg-[#020203]">
              <button 
                onClick={() => { if (profile?.username) navigate(`/archive/${profile.username}`); }} 
                className="group flex flex-col items-center gap-6 cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-24 h-24 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500 group-hover:scale-110 transition-all duration-500 bg-black">
                    <Plus className="text-zinc-500 group-hover:text-blue-500 group-hover:rotate-90 transition-all duration-500" size={40} />
                  </div>
                </div>
                <div className="text-center">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500 group-hover:text-white transition-colors mb-2">
                    Accessar todos projetos
                  </span>
                  {hasArchive && (
                    <span className="text-[9px] text-blue-500/50 font-bold uppercase tracking-widest">
                      +{profile.projects.length - featuredProjects.length} Projetos
                    </span>
                  )}
                </div>
              </button>
          </div>

          {/* Contact Section */}
          <SectionWrapper id="contact" index={sections.length - 1} setActiveSection={setActiveSection}>
            <div className="w-full max-w-5xl mx-auto">
              <h2 className="text-emerald-500 font-mono tracking-[0.5em] uppercase text-[10px] mb-12 flex items-center gap-4">
                <div className="w-12 h-px bg-emerald-500" /> Contato
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                  Vamos Construir<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400"> o Futuro</span>
                </h3>
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-12 space-y-8">
                  <div className="grid gap-4">
                    {profile.githubUrl && (
                      <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-white transition-all group">
                        <div className="flex items-center gap-4"><Github size={20} /><span className="font-bold uppercase tracking-tighter text-sm">Github</span></div>
                        <ExternalLink size={14} className="opacity-20 group-hover:opacity-100" />
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-blue-400 transition-all group">
                        <div className="flex items-center gap-4"><Linkedin size={20} className="text-blue-400" /><span className="font-bold uppercase tracking-tighter text-sm">Linkedin</span></div>
                        <ExternalLink size={14} className="opacity-20 group-hover:opacity-100" />
                      </a>
                    )}
                    
                    {/* PUXA O E-MAIL DO CAMPO 'EMAIL' SALVO NO PERFIL */}
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-emerald-500 transition-all group">
                        <div className="flex items-center gap-4">
                          <Mail size={20} className="text-emerald-500" />
                          <div className="flex flex-col">
                            <span className="font-bold uppercase tracking-tighter text-sm">Email</span>
                            <span className="text-[10px] text-zinc-500 font-mono lowercase">{profile.email}</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="opacity-20 group-hover:opacity-100" />
                      </a>
                    )}
                  </div>
                  <button onClick={handleStartChat} className="w-full py-6 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs">
                    <MessageSquare size={18} /> Estabelecer Conexão
                  </button>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </main>
      </div>
    </>
  );
};