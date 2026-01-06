import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Loader2, Building2, MapPin, Globe, Zap, Award, 
  Target, Briefcase, Users, Clock, Star, ChevronRight, 
  Terminal, Monitor, Linkedin, FileText, Layout
} from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

interface IOpenPosition {
  title: string;
  role: string;
  seniority: string;
  workMode: string; // Adicionado
  requirements: string;
  plus: string;
}

export const PerfilPublicoRecruiter = () => {
  const { username: urlUsername } = useParams();
  const navigate = useNavigate();
  const { user: loggedUser } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const endpoint = urlUsername ? `/profiles/public/${urlUsername}` : `/profiles/me`;
        const res = await api.get(endpoint);
        setData(res.data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [urlUsername]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );

  if (!data) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-widest">Erro_404: Perfil_Nao_Encontrado</div>;

  const profile = data.profile ? data.profile : data;
  const user = data.user || loggedUser;
  
  const cargoExibicao = profile?.role && profile.role !== 'RECRUITER' 
    ? profile.role 
    : 'Recrutador Técnico';

  const positions: IOpenPosition[] = Array.isArray(profile?.openPositions) ? profile.openPositions : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased selection:bg-emerald-500/30">
      <Helmet><title>{`${profile?.fullName || 'Recrutador'} | Mochila.dev`}</title></Helmet>

      {/* HEADER / BANNER */}
      <div className="relative h-48 md:h-64 w-full bg-slate-900 overflow-hidden">
        {profile?.bannerUrl ? (
          <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950" />
        )}
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-10 -mt-24 relative z-10">
          
          {/* SIDEBAR */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="space-y-6">
              <div className="relative inline-block p-1 bg-slate-800 rounded-sm shadow-2xl">
                <img 
                  src={profile?.avatar || user?.avatar || `https://ui-avatars.com/api/?name=${profile?.fullName}`} 
                  className="w-56 h-56 object-cover border border-slate-700 rounded-sm"
                  alt="Avatar"
                />
              </div>
              
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">{profile?.fullName || user?.fullName}</h1>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest">
                  {cargoExibicao}
                </p>
              </div>

              <div className="flex flex-col gap-3 py-6 border-y border-slate-900">
                <div className="flex items-center gap-3 text-slate-400 text-xs tracking-tight leading-none">
                  <Building2 size={14} className="text-slate-500" /> 
                  <span>{profile?.companyName} <span className="text-slate-600 ml-1">· {profile?.companySize}</span></span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-xs tracking-tight leading-none">
                  <MapPin size={14} className="text-slate-500" /> <span>{profile?.location}</span>
                </div>
                
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors text-xs tracking-tight leading-none">
                    <Linkedin size={14} className="text-blue-500" /> <span>LinkedIn Profissional</span>
                  </a>
                )}

                {profile?.websiteUrl && (
                  <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors text-xs tracking-tight leading-none">
                    <Globe size={14} className="text-slate-500" /> <span>Website / Carreiras</span>
                  </a>
                )}
              </div>

              {urlUsername && user?.id !== loggedUser?.id && (
                <button 
                  onClick={() => navigate(`/dashboard/chat?targetId=${user?.id}`)} 
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest transition-all rounded-sm shadow-lg shadow-emerald-950/20"
                >
                  Iniciar Conversa
                </button>
              )}
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <section className="flex-1 lg:mt-24 space-y-12">
            
            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-900/40 border border-slate-800 rounded-sm divide-x divide-slate-800 shadow-sm">
              {[
                { label: 'Hires', val: profile?.hiringStats_count, icon: Users },
                { label: 'Projetos', val: profile?.hiringStats_projects, icon: Briefcase },
                { label: 'Anos Exp', val: profile?.experienceYears, icon: Clock },
                { label: 'Avg Time', val: `${profile?.hiringStats_time}d`, icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="px-4 py-5 flex flex-col gap-1 items-start">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">{stat.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">{stat.val || 0}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Professional Summary</h3>
                <p className="text-lg text-slate-300 leading-relaxed font-normal max-w-3xl">
                  {profile?.bio || 'Nenhuma informação adicional fornecida.'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 py-8 border-y border-slate-900/50">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
                    <FileText size={14} /> Processo Seletivo
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {profile?.hiringProcess || 'Detalhes do processo sob consulta.'}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                    <Award size={14} /> Benefícios
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(profile?.benefits) ? profile.benefits.map((b: string) => (
                      <span key={b} className="text-[10px] text-slate-400 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded-sm">
                        {b}
                      </span>
                    )) : <span className="text-xs text-slate-500 italic">Informação não disponível</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* VAGAS ATIVAS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Vagas Ativas
                </h3>
                <span className="text-[10px] font-mono text-slate-600 uppercase">{positions.length} Resultados encontrados</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {positions.length > 0 ? (
                  positions.map((job, index) => (
                    <div key={index} className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all p-6 rounded-sm">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-tight">{job.role}</span>
                            <span className="text-slate-700 text-[10px]">•</span>
                            {/* NOVA BADGE DE MODALIDADE */}
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Layout size={10} className="text-slate-600" /> {job.workMode || 'Remoto'}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-white tracking-tight">{job.title}</h4>
                        </div>
                        <div className="px-3 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-tighter border border-slate-700 rounded-sm">
                          {job.seniority}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Target size={12} /> Requisitos Chave
                          </p>
                          <div className="text-xs text-slate-400 font-sans leading-relaxed whitespace-pre-line bg-slate-950/30 p-4 rounded-sm border border-slate-900/50">
                            {job.requirements}
                          </div>
                        </div>
                        {job.plus && (
                          <div className="space-y-2">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Star size={12} /> Diferenciais
                            </p>
                            <div className="text-xs text-slate-500 font-sans leading-relaxed whitespace-pre-line p-4">
                              {job.plus}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={() => navigate(`/dashboard/chat?targetId=${user?.id}&ref=${encodeURIComponent(job.title)}`)}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm"
                        >
                          Candidatar-se à vaga <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-slate-800 py-12 rounded-sm text-center">
                    <span className="text-[10px] font-mono text-slate-600 uppercase">Nenhuma oportunidade listada</span>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER DO PERFIL */}
            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-slate-900">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Tech Stack de Interesse</h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.technologies?.map((tech: string) => (
                    <span key={tech} className="px-2 py-1 bg-slate-900 text-slate-500 border border-slate-800 font-mono text-[9px] uppercase tracking-tighter">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Cultura & Missão</h4>
                <p className="text-xs text-slate-400 leading-relaxed italic border-l border-emerald-500/30 pl-4">
                  "{profile?.companyValues || 'Foco em transparência e colaboração técnica.'}"
                </p>
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
};