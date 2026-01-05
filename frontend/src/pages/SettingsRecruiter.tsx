import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useEffect, useState, useRef } from 'react';
import { 
  Loader2, Save, Building2, MapPin, Globe, Shield, 
  Target, Info, Camera, Image as ImageIcon,
  Users, Rocket, Heart, Star, Search, MessageSquare,
  Clock, Award, Zap, Briefcase, Linkedin
} from 'lucide-react';
import { AvatarUpload } from '../components/AvatarUpload';

const RECRUITER_ROLES = [
  "Recrutador Técnico (IT Recruiter)",
  "Tech Sourcing Specialist",
  "Recrutador de Engenharia",
  "Especialista em Atração de Talentos",
  "Recrutador de Produto & Design",
  "Gerente de Aquisição de Talentos (TA Manager)",
  "Head de Talentos",
  "Diretor de Recrutamento",
  "Lead Tech Recruiter",
  "Gerente de Contratação (Hiring Manager)",
  "Business Partner de RH (HRBP)",
  "Analista de Gente e Gestão",
  "Coordenador de RH",
  "Especialista em Employer Branding",
  "Chief People Officer (CPO)",
  "Consultor de Recrutamento Independente",
  "Recrutador Executivo (Headhunter)",
  "RPO Talent Acquisition",
  "Sócio-Recrutador"
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export const SettingsRecruiter = () => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  const avatarUrl = watch('avatar');
  const bannerUrl = watch('bannerUrl');

  const loadProfileData = async () => {
    try {
      const res = await api.get('/profiles/me');
      reset({ 
        ...res.data, 
        technologies: res.data.technologies?.join(', '),
        benefits: res.data.benefits?.join(', ')
      }); 
    } catch (err) { 
      console.error("Erro ao carregar dados do recrutador"); 
    } finally { 
      setFetching(false); 
    }
  };

  useEffect(() => { loadProfileData(); }, [reset]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingBanner(true);
    try {
      const res = await api.post('/profiles/upload-banner', formData);
      setValue('bannerUrl', res.data.url);
    } catch (err) {
      alert('Erro ao carregar banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  const onUpdateProfile = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        technologies: data.technologies ? data.technologies.split(',').map((t: string) => t.trim()) : [],
        benefits: data.benefits ? data.benefits.split(',').map((b: string) => b.trim()) : []
      };
      await api.put('/profiles/update', payload);
      alert('Perfil profissional atualizado com sucesso.');
    } catch (err) { 
      alert('Erro ao salvar.'); 
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 font-sans antialiased text-slate-200">
      
      {/* SEÇÃO DE BANNER E AVATAR - Sem overflow-hidden no container pai */}
      <div className="relative mb-28">
        <div className="relative h-64 w-full bg-slate-900 border border-slate-800 rounded-sm group overflow-hidden">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
               <ImageIcon size={48} className="text-slate-800" />
            </div>
          )}
          <button 
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-slate-950/60 cursor-pointer z-20"
          >
            {uploadingBanner ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white mb-2" />}
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Atualizar_Capa_Corporativa</span>
          </button>
          <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
        </div>

        {/* Container do Avatar - Posicionado fora do overflow do banner */}
        <div className="absolute -bottom-16 left-12 z-30">
          <div className="p-1 bg-slate-950 rounded-sm shadow-2xl">
            <div className="border-[6px] border-slate-950">
              <AvatarUpload currentAvatar={avatarUrl} />
            </div>
          </div>
        </div>
      </div>

      <header className="mb-12 pt-6 flex flex-col md:flex-row justify-between items-center md:items-end border-b border-slate-900 pb-8 gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Perfil_Mestre_Recrutador</h1>
            <Shield size={20} className="text-emerald-500" />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Autoridade Máxima em Contratação</p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Estado da Conta</p>
           <p className="text-xs text-emerald-500 font-mono uppercase tracking-widest">🛡️ Verificado & Ativo</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-12">
        
        {/* 01. IDENTIDADE */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-emerald-500">
            <Info size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">01. Identidade_Profissional</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          
          <div className="bg-slate-900/30 border border-slate-800 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-inner">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
              <input {...register('fullName')} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none focus:border-emerald-600 transition-all text-sm text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cargo Atual</label>
              <select {...register('role')} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none text-white text-[11px] uppercase font-bold cursor-pointer focus:border-emerald-600 transition-all">
                {RECRUITER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pitch de Atração (Bio)</label>
              <textarea {...register('bio')} rows={4} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none focus:border-emerald-600 transition-all text-slate-300 text-sm leading-relaxed" placeholder="Como você conecta os melhores talentos às melhores oportunidades?" />
            </div>
          </div>
        </section>

        {/* 02. PARAMETROS CORPORATIVOS */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-blue-500">
            <Building2 size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">02. Parametros_Empresa</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          
          <div className="bg-slate-900/30 border border-slate-800 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-inner">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Organização</label>
              <input {...register('companyName')} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none focus:border-blue-600 transition-all text-sm text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Porte da Empresa</label>
              <select {...register('companySize')} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none text-white text-[11px] uppercase font-bold focus:border-blue-600 transition-all">
                {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} Colaboradores</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sede Principal</label>
              <input {...register('location')} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none focus:border-blue-600 transition-all text-sm text-white" placeholder="Cidade / Remoto" />
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Target size={12} className="text-emerald-500" /> Stack de Contratação (Separe por vírgula)
              </label>
              <input {...register('technologies')} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none focus:border-emerald-600 transition-all text-sm text-white font-mono" placeholder="Ex: React, Node.js, Go, Python, AWS..." />
            </div>
          </div>
        </section>

        {/* 03. MÉTRICAS */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-orange-500">
            <Zap size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">03. Metricas_Profissionais</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          
          <div className="bg-slate-900/30 border border-slate-800 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-600 uppercase">Hires Realizados</label>
              <input type="number" {...register('hiringStats_count')} className="w-full bg-transparent border-none p-0 outline-none text-2xl font-black text-white" placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-600 uppercase">Projetos Ativos</label>
              <input type="number" {...register('hiringStats_projects')} className="w-full bg-transparent border-none p-0 outline-none text-2xl font-black text-white" placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-600 uppercase">Anos_Carreira</label>
              <input type="number" {...register('experienceYears')} className="w-full bg-transparent border-none p-0 outline-none text-2xl font-black text-white" placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-600 uppercase">Time-to-Hire (dias)</label>
              <input type="number" {...register('hiringStats_time')} className="w-full bg-transparent border-none p-0 outline-none text-2xl font-black text-white" placeholder="0" />
            </div>
          </div>
        </section>

        {/* 04. CULTURA E PROCESSO */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-pink-500">
            <Heart size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">04. Cultura_E_Processo</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          
          <div className="bg-slate-900/30 border border-slate-800 p-8 space-y-8 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Benefícios Disponíveis</label>
                <textarea {...register('benefits')} rows={3} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none focus:border-pink-600 transition-all text-sm text-white" placeholder="Stock Options, Home Office, Saúde..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Etapas do Processo</label>
                <textarea {...register('hiringProcess')} rows={3} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none focus:border-pink-600 transition-all text-sm text-white" placeholder="Screening, Desafio Técnico, Fit Cultural..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Missão & Valores da Empresa</label>
              <textarea {...register('companyValues')} rows={2} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-sm outline-none focus:border-emerald-600 transition-all text-sm text-white italic" />
            </div>
          </div>
        </section>

        {/* 05. CANAIS */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-slate-400">
            <Globe size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">05. Canais_De_Conexao</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          
          <div className="bg-slate-900/30 border border-slate-800 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 p-4">
              <Linkedin className="text-blue-500" size={20} />
              <div className="flex-1">
                <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Perfil LinkedIn</label>
                <input {...register('linkedinUrl')} className="w-full bg-transparent border-none p-0 outline-none text-xs text-white" placeholder="linkedin.com/in/usuario" />
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 p-4">
              <Briefcase className="text-slate-400" size={20} />
              <div className="flex-1">
                <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Página de Carreiras</label>
                <input {...register('websiteUrl')} className="w-full bg-transparent border-none p-0 outline-none text-xs text-white" placeholder="empresa.com.br/carreiras" />
              </div>
            </div>
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="pt-12 border-t border-slate-900">
          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.4em] text-sm transition-all cursor-pointer flex items-center justify-center gap-4 rounded-sm shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Sincronizar_Perfil_Recrutador
          </button>
        </div>
      </form>
    </div>
  );
};