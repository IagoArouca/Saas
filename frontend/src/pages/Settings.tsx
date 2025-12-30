import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useEffect, useState, useRef } from 'react';
import { 
  Loader2, Save, Globe, Github, 
  Youtube, Linkedin, Code2, Type, AlignLeft,
  ShieldCheck, Zap, Camera, Sparkles, Briefcase, BarChart3
} from 'lucide-react';
import { AvatarUpload } from '../components/AvatarUpload';

// Opções para os novos campos
const ROLES = [
  "Frontend Developer", "Backend Developer", "Fullstack Developer", 
  "Mobile Developer", "DevOps Engineer", "Data Scientist", 
  "UI/UX Designer", "QA Engineer", "Security Specialist"
];

const LEVELS = ["Junior", "Pleno", "Senior", "Specialist / Lead"];

export const Settings = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const avatarUrl = watch('avatar');
  const bannerUrl = watch('bannerUrl');

  const loadProfileData = async () => {
    try {
      const res = await api.get('/profiles/me');
      const data = {
        ...res.data,
        youtubeUrl: res.data.youtube,
        technologies: res.data.technologies?.join(', ')
      };
      reset(data); 
    } catch (err) {
      console.error("Erro ao carregar perfil");
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
      await api.post('/profiles/upload-banner', formData);
      await loadProfileData();
    } catch (err) {
      alert("Erro ao sincronizar banner.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const onUpdateProfile = async (data: any) => {
    setLoading(true);
    try {
      const { id, userId, user, visits, ...rest } = data;
      const payload = {
        ...rest,
        youtube: rest.youtubeUrl,
        technologies: rest.technologies 
          ? rest.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t !== "") 
          : []
      };
      delete (payload as any).youtubeUrl;
      
      await api.put('/profiles/update', payload);
      alert('Sincronização Neural Completa!');
      await loadProfileData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha na conexão com o mainframe.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-screen items-center justify-center bg-[#020203]">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="animate-spin text-blue-500" size={48} strokeWidth={1} />
        <span className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.5em] animate-pulse">Initializing_Identity_Module...</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-1000">
      
      {/* SEÇÃO DE BANNER */}
      <section className="relative h-64 rounded-[2.5rem] overflow-hidden border border-white/5 mb-12 group bg-[#0a0a0c]">
        {bannerUrl ? (
          <img src={bannerUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="Cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020203] to-transparent" />
        
        <div className="absolute bottom-6 right-6">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            {uploadingBanner ? <Loader2 className="animate-spin" size={14}/> : <Camera size={14} />}
            {uploadingBanner ? 'Sincronizando...' : 'Update_Cover_Art'}
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
        </div>
      </section>

      {/* HEADER DE IDENTIDADE */}
      <header className="relative -mt-32 mb-16 flex flex-col md:flex-row items-center md:items-end gap-8 px-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <AvatarUpload currentAvatar={avatarUrl} />
        </div>
        <div className="flex-1 text-center md:text-left pb-4">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <ShieldCheck className="text-blue-500" size={16} />
            <span className="text-[10px] font-mono text-blue-500 font-black uppercase tracking-[0.4em]">Biometric_Verified</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Config_Core</h1>
        </div>
      </header>
      
      <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0a0a0c]/50 p-10 rounded-[3rem] border border-white/5 relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Sparkles size={120} />
          </div>

          <div className="md:col-span-2 flex items-center gap-4 mb-4">
            <h2 className="text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3">
               <Type size={14} className="text-blue-500"/> Personal_Dossier
            </h2>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          {/* INPUT NOME */}
          <div className="space-y-3 group">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">Full_Name_Entry</label>
            <div className="bg-black/40 border border-white/5 rounded-2xl focus-within:border-blue-500/50 transition-all p-1">
              <input {...register('fullName')} className="w-full bg-transparent p-4 outline-none text-white font-medium placeholder:text-slate-800" placeholder="Ex: Iago Arouca" />
            </div>
          </div>

          {/* INPUT USERNAME */}
          <div className="space-y-3 group">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">Access_Protocol</label>
            <div className="flex items-center bg-black/40 border border-white/5 rounded-2xl focus-within:border-blue-500/50 transition-all p-1">
              <span className="pl-4 text-blue-500 font-mono text-xs">@</span>
              <input {...register('username')} className="flex-1 bg-transparent p-4 outline-none text-white font-mono text-sm" />
            </div>
          </div>

          {/* --- NOVOS CAMPOS: PROFISSÃO E NÍVEL --- */}
          
          <div className="space-y-3 group">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">Career_Specialization</label>
            <div className="flex items-center bg-black/40 border border-white/5 rounded-2xl focus-within:border-blue-500/50 transition-all p-1 px-4">
              <Briefcase size={14} className="text-blue-500 mr-2 opacity-50" />
              <select 
                {...register('role')} 
                className="w-full bg-transparent p-4 outline-none text-white font-mono text-xs uppercase appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#020203]">SELECT_ROLE</option>
                {ROLES.map(role => (
                  <option key={role} value={role} className="bg-[#020203]">{role.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 group">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">Skill_Tier_Level</label>
            <div className="flex items-center bg-black/40 border border-white/5 rounded-2xl focus-within:border-blue-500/50 transition-all p-1 px-4">
              <BarChart3 size={14} className="text-blue-500 mr-2 opacity-50" />
              <select 
                {...register('level')} 
                className="w-full bg-transparent p-4 outline-none text-white font-mono text-xs uppercase appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#020203]">SELECT_LEVEL</option>
                {LEVELS.map(level => (
                  <option key={level} value={level} className="bg-[#020203]">{level.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* -------------------------------------- */}

          {/* TECH STACK CARD */}
          <div className="md:col-span-2 space-y-3 group">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">
              Neural_Stack_Modules (Comma_Separated)
            </label>
            <div className="relative bg-black/40 border border-white/5 rounded-2xl focus-within:border-blue-500/50 transition-all overflow-hidden">
              <input 
                {...register('technologies')} 
                className="w-full bg-transparent p-5 outline-none text-white font-mono text-xs uppercase tracking-tighter" 
                placeholder="REACT, NODEJS, NESTJS, POSTGRESQL..." 
              />
              <div className="absolute bottom-0 left-0 h-[1px] bg-blue-500 w-0 group-focus-within:w-full transition-all duration-1000" />
            </div>
          </div>

          {/* BIO CARD */}
          <div className="md:col-span-2 space-y-3 group">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">Biography_Buffer</label>
            <div className="bg-black/40 border border-white/5 rounded-[2rem] focus-within:border-blue-500/50 transition-all p-2">
              <textarea 
                {...register('bio')} 
                rows={4} 
                className="w-full bg-transparent p-4 outline-none text-slate-300 transition-all resize-none text-sm italic leading-relaxed" 
                placeholder="Descreva seu propósito técnico..." 
              />
            </div>
          </div>
        </div>

        {/* CANAIS DIGITAIS */}
        <div className="bg-[#0a0a0c]/50 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'githubUrl', icon: Github, label: 'Github', color: 'text-white' },
              { id: 'youtubeUrl', icon: Youtube, label: 'Youtube', color: 'text-red-500' },
              { id: 'linkedinUrl', icon: Linkedin, label: 'Linkedin', color: 'text-blue-400' }
            ].map((item) => (
              <div key={item.id} className="group">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 block ml-1">{item.label}_Link</label>
                <div className="relative flex items-center bg-black border border-white/5 rounded-2xl focus-within:border-white/20 transition-all p-1">
                  <div className={`p-3 rounded-xl bg-white/[0.02] ${item.color} opacity-40 group-focus-within:opacity-100 transition-opacity`}>
                    <item.icon size={18} />
                  </div>
                  <input 
                    {...register(item.id as any)} 
                    className="flex-1 bg-transparent p-3 outline-none text-[10px] text-white font-mono placeholder:text-slate-900" 
                    placeholder="URL_PATH" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={loading} 
            className="group relative px-20 py-6 bg-white text-black rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-4">
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="tracking-[0.4em] uppercase text-[10px]">Execute_Update_Protocol</span>
                  <Save size={18} />
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>
      </form>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        select option {
          background-color: #020203;
          color: white;
        }
      `}</style>
    </div>
  );
};