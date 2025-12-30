import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import { Helmet } from 'react-helmet-async';
import { 
  Github, 
  Linkedin, 
  ExternalLink, 
  ChevronDown, 
  Mail, 
  MessageSquare,
  Code2,
  Loader2,
  Briefcase,
  Shield,
  Layers // Ícone para o botão de ver mais
} from 'lucide-react';
import api from '../services/api';

// --- COMPONENTES AUXILIARES ---

const SectionWrapper = ({ id, children, index, setActiveSection, bgImage }: any) => {
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
      {bgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src={bgImage} 
            alt="" 
            className="w-full h-full object-cover opacity-[0.2] grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-transparent to-[#020203]" />
          <div className="absolute inset-0 bg-[#020203]/30" />
        </div>
      )}
      
      <div className="relative z-10 w-full max-w-7xl">
        {children}
      </div>
    </section>
  );
};

export const PublicProfile = () => {
  const { username: urlUsername } = useParams();
  const navigate = useNavigate(); // Hook para navegação
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  const fetchProfile = async () => {
    try {
      let targetUsername = urlUsername;
      if (!targetUsername) {
        const resMe = await api.get('/profiles/me');
        targetUsername = resMe.data.username;
      }
      const res = await api.get(`/profiles/public/${targetUsername}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Perfil não encontrado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [urlUsername]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  if (!profile) return null;

  // --- LÓGICA DE FILTRAGEM ---
  // Filtra apenas projetos destacados e limita a 3
  const featuredProjects = profile.projects?.filter((p: any) => p.isHighlighted).slice(0, 3) || [];
  const hasMoreProjects = (profile.projects?.length || 0) > featuredProjects.length;

  const sections = [
    { id: 'briefing', label: 'Briefing' },
    { id: 'stack', label: 'Tech_Stack' },
    ...(featuredProjects.map((_: any, i: number) => ({ id: `project-${i}`, label: `Artifact_0${i+1}` }))),
    { id: 'contact', label: 'Contact_Link' }
  ];

  return (
    <>
      <Helmet>
        <title>{`${profile.fullName || profile.username} | Dev_Dossier`}</title>
      </Helmet>

      {/* NAVEGAÇÃO LATERAL */}
      <nav className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-8">
        {sections.map((sec, i) => (
          <button
            key={sec.id}
            onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative flex items-center justify-end"
          >
            <span className={`absolute right-8 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-300 pointer-events-none ${
              activeSection === i ? 'text-blue-500 opacity-100 translate-x-0' : 'text-white/20 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
            }`}>
              {sec.label}
            </span>
            <div className={`transition-all duration-500 rounded-full ${
              activeSection === i ? 'w-10 h-1 bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'w-3 h-1 bg-white/10 group-hover:bg-white/40'
            }`} />
          </button>
        ))}
      </nav>

      <div className="min-h-screen bg-[#020203] text-white selection:bg-blue-500/30 font-sans text-left">
        
        {/* HEADER AREA */}
        <header className="relative h-[35rem] w-full overflow-hidden border-b border-white/5">
          {profile.bannerUrl ? (
            <img src={profile.bannerUrl} className="w-full h-full object-cover opacity-40" alt="" />
          ) : (
            <div className="w-full h-full bg-[#0a0a0c] opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent" />
          
          <div className="absolute bottom-10 left-0 w-full px-6 md:px-20 text-left">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <img src={profile.avatar || 'https://via.placeholder.com/150'} className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] border-4 border-[#020203] object-cover shadow-2xl" alt="" />
              <div className="text-left">
                <div className="flex gap-2 mb-3">
                  {profile.role && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider text-blue-400">
                      <Briefcase size={10} /> {profile.role}
                    </span>
                  )}
                  {profile.level && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      <Shield size={10} /> {profile.level}
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-2">{profile.fullName || profile.username}</h1>
                <p className="text-blue-500 font-mono text-xs tracking-widest uppercase">@{profile.username}</p>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* SEÇÃO 01: BRIEFING */}
          <SectionWrapper id="briefing" index={0} setActiveSection={setActiveSection} bgImage="https://images.unsplash.com/photo-1510511459019-5dee997dd1db?q=80&w=2070">
            <div className="max-w-4xl text-left relative">
              <h2 className="text-blue-500 font-mono tracking-[0.5em] uppercase text-xs mb-8">Protocol_01 // Briefing</h2>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] mb-10">
                {(profile.role || "Specialist").replace(' ', '_')}<span className="text-blue-500">.</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl">
                {profile.bio || "No bio available."}
              </p>
              <div className="mt-16 flex justify-start animate-bounce text-blue-500 opacity-50">
                <ChevronDown size={48} strokeWidth={1} />
              </div>
            </div>
          </SectionWrapper>

          {/* SEÇÃO 02: TECH STACK */}
          <SectionWrapper id="stack" index={1} setActiveSection={setActiveSection} bgImage="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-1 text-left">
                <h2 className="text-blue-500 font-mono tracking-[0.5em] uppercase text-xs mb-6">Expertise</h2>
                <h3 className="text-5xl font-black italic uppercase tracking-tighter">Core_Systems</h3>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {profile.technologies?.map((tech: string) => (
                  <div key={tech} className="p-6 bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                    <Code2 className="text-blue-500 opacity-40 group-hover:opacity-100" size={20} />
                    <span className="font-mono text-sm uppercase tracking-widest">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          {/* SEÇÕES DE PROJETOS (Limitadas aos destaques) */}
          {featuredProjects.map((project: any, i: number) => (
            <SectionWrapper 
              key={i} 
              id={`project-${i}`} 
              index={i + 2} 
              setActiveSection={setActiveSection}
              bgImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 lg:order-1 text-left">
                  <span className="text-blue-500 font-mono text-[10px] tracking-[0.5em]">ARTIFACT_0{i+1}</span>
                  <h3 className="text-6xl font-black italic uppercase tracking-tighter mt-4 mb-8">{project.title}</h3>
                  <p className="text-zinc-400 text-lg mb-6 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-10">
                    {project.technologies?.map((t: string) => (
                      <span key={t} className="px-4 py-1 border border-white/10 text-[10px] font-mono uppercase text-zinc-500 italic">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <a href={project.deployUrl || "#"} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                      <span className="group-hover:text-blue-500 transition-colors">Launch_Live</span>
                      <div className="h-px w-12 bg-white/20 group-hover:w-20 group-hover:bg-blue-500 transition-all" />
                    </a>

                    {/* BOTÃO VER MAIS: Aparece apenas no último projeto da lista se houver mais no total */}
                    {i === featuredProjects.length - 1 && hasMoreProjects && (
                      <button 
                        onClick={() => navigate(`/archive/${profile.username}`)}
                        className="group flex items-center gap-4 px-6 py-3 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-500"
                      >
                        <Layers size={14} className="group-hover:rotate-12 transition-transform" />
                        Explore_Full_Archive
                      </button>
                    )}
                  </div>
                </div>
                <div className="order-1 lg:order-2 aspect-video bg-zinc-900 border border-white/5 relative overflow-hidden group">
                  <img src={project.imageUrl || `https://picsum.photos/seed/${i}/800/450`} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
                </div>
              </div>
            </SectionWrapper>
          ))}

          {/* SEÇÃO FINAL: CONTATO */}
          <SectionWrapper 
            id="contact" 
            index={sections.length - 1} 
            setActiveSection={setActiveSection}
            bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072"
          >
            <div className="w-full max-w-5xl mx-auto">
              <h2 className="text-emerald-500 font-mono tracking-[0.5em] uppercase text-[10px] mb-12 flex items-center gap-4 text-left">
                <div className="w-12 h-px bg-emerald-500" /> Final_Transmission
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-10 text-left">
                  <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                    Let's_Build <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">The_Future</span>
                  </h3>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-12 space-y-8 relative overflow-hidden group/card text-left">
                  <div className="space-y-6 relative z-10">
                    <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Connect_Channels</h4>
                    <div className="grid gap-4">
                      <a href={`mailto:${profile.email || ''}`} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <Mail className="text-emerald-500" size={20} />
                          <span className="font-bold uppercase tracking-tighter text-sm">Direct_Mail</span>
                        </div>
                        <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <a href={profile.linkedinUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <Linkedin className="text-blue-500" size={20} />
                          <span className="font-bold uppercase tracking-tighter text-sm">LinkedIn_Node</span>
                        </div>
                        <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <a href={profile.githubUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-zinc-400/50 hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <Github className="text-white" size={20} />
                          <span className="font-bold uppercase tracking-tighter text-sm">GitHub_Trace</span>
                        </div>
                        <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                  <button className="w-full py-6 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs">
                    <MessageSquare size={18} />
                    Establish_Connection
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