import { useForm, useFieldArray } from 'react-hook-form';
import api from '../services/api';
import { useEffect, useState, useRef } from 'react';
import { 
  Loader2, Save, Building2, MapPin, Globe, Shield, 
  Search, Info, Camera, Image as ImageIcon,
  Plus, Trash2, Zap, Briefcase, Linkedin, Star, Target
} from 'lucide-react';
import { AvatarUpload } from '../components/AvatarUpload';

// --- INTERFACES ---
interface OpenPosition {
  title: string;
  role: string;
  seniority: string;
  workMode: string; // Adicionado: Remoto, Presencial, Híbrido
  requirements: string;
  plus: string;
}

interface RecruiterFormValues {
  username: string;
  fullName: string;
  role: string;
  bio: string;
  companyName: string;
  companySize: string;
  location: string;
  technologies: string;
  experienceYears: number;
  hiringStats_count: number;
  hiringStats_projects: number;
  hiringStats_time: number;
  benefits: string;
  hiringProcess: string;
  companyValues: string;
  linkedinUrl: string;
  websiteUrl: string;
  avatar: string;
  bannerUrl: string;
  openPositions: OpenPosition[];
}

const RECRUITER_ROLES = [
  "Recrutador Técnico (IT Recruiter)", 
  "Tech Sourcing Specialist", 
  "Recrutador de Engenharia",
  "Especialista em Atração de Talentos", 
  "Gerente de Aquisição de Talentos",
  "Head de Talentos", 
  "Hiring Manager"
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const JOB_ROLES = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "QA", "Data", "UX/UI"];
const SENIORITIES = ["Estágio", "Júnior", "Pleno", "Sênior", "Staff", "Lead"];
const WORK_MODES = ["Remoto", "Híbrido", "Presencial"]; // Opções de modalidade

export const SettingsRecruiter = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, setValue, control } = useForm<RecruiterFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "openPositions" });

  const avatarUrl = watch('avatar');
  const bannerUrl = watch('bannerUrl');

  const loadProfileData = async () => {
    try {
      const res = await api.get('/profiles/me');
      const data = res.data;
      
      const profileInfo = data.recruiterProfile || data;
      const currentUsername = profileInfo.username || data.username || '';

      reset({ 
        ...profileInfo,
        username: currentUsername,
        technologies: Array.isArray(profileInfo.technologies) ? profileInfo.technologies.join(', ') : '',
        benefits: Array.isArray(profileInfo.benefits) ? profileInfo.benefits.join(', ') : '',
        openPositions: Array.isArray(profileInfo.openPositions) ? profileInfo.openPositions : []
      }); 
    } catch (err) { 
      console.error("Erro ao carregar dados"); 
    } finally { setFetching(false); }
  };

  useEffect(() => { loadProfileData(); }, []);

  const onUpdateProfile = async (formData: RecruiterFormValues) => {
    setLoading(true);
    try {
      await api.put('/profiles/update', {
        ...formData,
        username: formData.username.toLowerCase().trim()
      });
      alert('Perfil e Username sincronizados!');
      window.location.reload(); 
    } catch (err: any) { 
      alert(err.response?.data?.message || 'Erro ao salvar'); 
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 font-sans antialiased text-slate-200">
      
      {/* 00. BANNER E AVATAR */}
      <div className="relative mb-28">
        <div className="relative h-64 w-full bg-slate-900 border border-slate-800 rounded-sm group overflow-hidden">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
               <ImageIcon size={48} className="text-slate-800" />
            </div>
          )}
          <button type="button" onClick={() => bannerInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-slate-950/60 cursor-pointer z-20">
            {uploadingBanner ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white mb-2" />}
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Atualizar_Capa</span>
          </button>
          <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={async (e) => {
             const file = e.target.files?.[0]; if(!file) return;
             const fd = new FormData(); fd.append('file', file);
             setUploadingBanner(true);
             try {
               const res = await api.post('/profiles/upload-banner', fd);
               setValue('bannerUrl', res.data.url);
             } finally { setUploadingBanner(false); }
          }} />
        </div>

        <div className="absolute -bottom-16 left-12 z-30">
          <div className="p-1 bg-slate-950 rounded-sm shadow-2xl border-[6px] border-slate-950">
            <AvatarUpload currentAvatar={avatarUrl || ''} />
          </div>
        </div>
      </div>

      <header className="mb-12 pt-6 border-b border-slate-900 pb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Perfil_Recrutador</h1>
          <Shield size={20} className="text-emerald-500" />
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Gestão de Identidade e Autoridade</p>
      </header>

      <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-12">
        
        {/* 01. USERNAME */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-slate-400">
            <Search size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Config_Indexação</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 p-8">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Username Público</label>
            <div className="flex items-center max-w-xl">
              <div className="bg-slate-950 border border-r-0 border-slate-800 p-4 text-slate-600 text-xs font-mono">/p/</div>
              <input 
                {...register('username', { required: true })} 
                className="w-full bg-slate-950 border border-slate-800 p-4 text-emerald-500 font-bold outline-none focus:border-emerald-500" 
              />
            </div>
          </div>
        </section>

        {/* 02. DADOS PESSOAIS */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-slate-400">
            <Info size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Identidade_Visual</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
              <input {...register('fullName')} className="w-full bg-slate-950 border border-slate-800 p-4 text-white outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cargo Profissional</label>
              <select {...register('role')} className="w-full bg-slate-950 border border-slate-800 p-4 text-white uppercase text-[11px] font-bold cursor-pointer">
                {RECRUITER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bio / Pitch</label>
              <textarea {...register('bio')} rows={4} className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-sm outline-none" />
            </div>
          </div>
        </section>

        {/* 03. EMPRESA */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-slate-400">
            <Building2 size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Empresa_E_Localização</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Nome da Empresa</label>
              <input {...register('companyName')} className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Tamanho</label>
              <select {...register('companySize')} className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-[11px] font-bold">
                {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} Colaboradores</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Localização</label>
              <input {...register('location')} className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-sm outline-none" />
            </div>
          </div>
        </section>

        {/* 04. MÉTRICAS */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-slate-400">
            <Zap size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Métricas_De_Recrutamento</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase">Hires Totais</label>
              <input type="number" {...register('hiringStats_count')} className="w-full bg-transparent p-0 text-2xl font-black text-white outline-none border-b border-slate-900 focus:border-orange-500" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase">Anos Exp.</label>
              <input type="number" {...register('experienceYears')} className="w-full bg-transparent p-0 text-2xl font-black text-white outline-none border-b border-slate-900 focus:border-orange-500" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase">Avg Time (Days)</label>
              <input type="number" {...register('hiringStats_time')} className="w-full bg-transparent p-0 text-2xl font-black text-white outline-none border-b border-slate-900 focus:border-orange-500" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-600 uppercase">Projetos Ativos</label>
              <input type="number" {...register('hiringStats_projects')} className="w-full bg-transparent p-0 text-2xl font-black text-white outline-none border-b border-slate-900 focus:border-orange-500" />
            </div>
          </div>
        </section>

        {/* 05. VAGAS ABERTAS */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-slate-400">
            <Briefcase size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Oportunidades_Ativas</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-slate-900/40 border border-slate-800 p-6 relative rounded-sm">
                <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <input 
                    {...register(`openPositions.${index}.title`)} 
                    placeholder="Título da Vaga" 
                    className="bg-slate-950 border border-slate-800 p-3 text-sm text-white outline-none" 
                  />
                  <select {...register(`openPositions.${index}.role`)} className="bg-slate-950 border border-slate-800 p-3 text-xs text-white uppercase font-bold">
                    {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select {...register(`openPositions.${index}.seniority`)} className="bg-slate-950 border border-slate-800 p-3 text-xs text-white uppercase font-bold">
                    {SENIORITIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {/* NOVO CAMPO: Modalidade */}
                  <select {...register(`openPositions.${index}.workMode`)} className="bg-slate-950 border border-slate-800 p-3 text-xs text-emerald-500 uppercase font-bold outline-none">
                    {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <textarea {...register(`openPositions.${index}.requirements`)} placeholder="Requisitos" className="bg-slate-950 border border-slate-800 p-3 text-xs text-slate-300 h-24" />
                   <textarea {...register(`openPositions.${index}.plus`)} placeholder="Diferenciais" className="bg-slate-950 border border-slate-800 p-3 text-xs text-slate-400 h-24" />
                </div>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => append({ title: '', role: 'Frontend', seniority: 'Pleno', workMode: 'Remoto', requirements: '', plus: '' })} 
              className="w-full py-4 border border-dashed border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-slate-500 flex items-center justify-center gap-2"
            >
              <Plus size={16} /> <span className="text-[10px] font-black uppercase">Adicionar_Nova_Vaga</span>
            </button>
          </div>
        </section>

        {/* 06. LINKS SOCIAIS */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-slate-400">
            <Globe size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Conexões_Externas</h2>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Linkedin size={12} className="text-blue-500" /> LinkedIn URL</label>
              <input {...register('linkedinUrl')} className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-xs outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Globe size={12} className="text-emerald-500" /> Website/Carreiras</label>
              <input {...register('websiteUrl')} className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-xs outline-none" />
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-slate-900 flex justify-end">
          <button 
            disabled={loading} 
            type="submit" 
            className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-3 rounded-sm shadow-xl shadow-emerald-900/10"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Salvar_Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
};