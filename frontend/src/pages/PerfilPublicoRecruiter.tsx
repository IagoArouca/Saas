import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MessageSquare, Loader2, CheckCircle2, 
  Linkedin, Building2, MapPin, 
  Globe, ExternalLink, Shield,
  Zap, Heart, Target, Briefcase, Award
} from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export const PerfilPublicoRecruiter = () => {
  const { username: urlUsername } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let targetUsername = urlUsername || user?.username;
        if (targetUsername) {
          const res = await api.get(`/profiles/public/${targetUsername}`);
          setProfile(res.data);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil corporativo");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [urlUsername, user?.username]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/20 font-sans antialiased">
      <Helmet>
        <title>{`${profile?.fullName || 'Recrutador'} | Perfil Corporativo`}</title>
      </Helmet>

      {/* Seção de Banner Hero - Agora com o Banner dinâmico sem edição */}
      <div className="relative h-72 w-full overflow-hidden border-b border-slate-800">
        {profile?.bannerUrl ? (
          <>
            <img 
              src={profile.bannerUrl} 
              alt="Capa Corporativa" 
              className="w-full h-full object-cover grayscale-[40%] brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
            <Building2 size={80} className="text-slate-800 opacity-20" />
          </div>
        )}
        
        <div className="absolute bottom-6 right-8">
           <div className="px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">
             ID_SISTEMA: {profile?.userId?.slice(-12).toUpperCase()}
           </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Coluna Esquerda: Identidade & Metricas Reais */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <div className="relative w-48 h-48 -mt-32">
                <img 
                  src={profile?.avatar || 'https://via.placeholder.com/200'} 
                  className="w-full h-full object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 border-4 border-slate-950 shadow-2xl" 
                  alt="Avatar" 
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 p-2 border-4 border-slate-950">
                  <Shield size={18} className="text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                  {profile?.fullName}
                </h1>
                <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">
                  {profile?.role}
                </p>
                <p className="text-slate-500 text-xs mt-3 flex items-center gap-2 font-medium">
                  <Building2 size={14} /> {profile?.companyName}
                </p>
                <p className="text-slate-500 text-xs mt-1 flex items-center gap-2">
                  <MapPin size={14} /> {profile?.location || 'Global / Remote'}
                </p>
              </div>
            </div>

            {/* Métricas Reais do Banco de Dados */}
            <div className="grid grid-cols-2 gap-px bg-slate-800 border border-slate-800">
              <div className="bg-slate-950 p-5">
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Hires</p>
                <p className="text-xl font-mono text-white">{profile?.hiringStats_count || '0'}</p>
              </div>
              <div className="bg-slate-950 p-5">
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Exp. Anos</p>
                <p className="text-xl font-mono text-white">{profile?.experienceYears || '0'}</p>
              </div>
              <div className="bg-slate-950 p-5">
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Time-to-Hire</p>
                <p className="text-xl font-mono text-white">{profile?.hiringStats_time || '--'}d</p>
              </div>
              <div className="bg-slate-950 p-5">
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Projetos</p>
                <p className="text-xl font-mono text-white">{profile?.hiringStats_projects || '0'}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => navigate(`/dashboard/chat?targetId=${profile.userId}`)}
                className="w-full py-4 bg-emerald-600 text-white hover:bg-emerald-500 transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-sm shadow-lg shadow-emerald-900/20"
              >
                <MessageSquare size={16} /> Abrir_Canal_Direto
              </button>
              
              <div className="flex gap-2">
                <a href={profile?.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                  <Linkedin size={14} className="text-blue-500" /> LinkedIn
                </a>
                <a href={profile?.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                  <Globe size={14} /> Website
                </a>
              </div>
            </div>
          </aside>

          {/* Coluna Direita: Informações Detalhadas */}
          <section className="lg:col-span-8 space-y-12">
            
            {/* Bio Profissional */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-3">
                <div className="h-px w-8 bg-emerald-500" /> Professional_Summary
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed font-light">
                {profile?.bio || 'Perfil em fase de sincronização de dados corporativos.'}
              </p>
            </div>

            {/* Cultura & Valores (Novo) */}
            <div className="bg-slate-900/20 border border-slate-800 p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                  <Heart size={16} className="text-pink-500" /> Missão & Cultura
                </h3>
                <p className="text-slate-400 text-sm italic leading-relaxed">
                  "{profile?.companyValues || 'Nossos valores são pautados pela transparência e excelência técnica.'}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Award size={14} /> Benefícios_E_Vantagens
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile?.benefits?.map((benefit: string) => (
                      <span key={benefit} className="text-[10px] px-2 py-1 bg-slate-900 text-slate-400 border border-slate-800">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} /> Fluxo_De_Contratação
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {profile?.hiringProcess || 'O processo seletivo segue os padrões globais da organização.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Ecossistema Tecnológico */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Stacks_Em_Foco</h3>
              <div className="flex flex-wrap gap-3">
                {profile?.technologies?.map((tech: string) => (
                  <div key={tech} className="flex items-center gap-2 px-5 py-3 border border-slate-800 bg-slate-950/50 hover:border-emerald-500/50 transition-colors">
                    <Target size={14} className="text-emerald-500" />
                    <span className="text-xs font-mono font-bold text-slate-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-4 text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                <span>© {new Date().getFullYear()} Talent_Cloud</span>
                <span>Porte: {profile?.companySize || '--'} Colaboradores</span>
              </div>
              <span className="text-[9px] font-mono text-slate-800">DATA_SYNC_STABLE_{profile?.userId?.slice(0,8)}</span>
            </footer>

          </section>
        </div>
      </main>
    </div>
  );
};