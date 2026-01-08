import { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import api from '../services/api';
import { 
  Plus, Github, ExternalLink, Trash2, Image as ImageIcon, 
  Loader2, X, Layout, AlignLeft, Code2, Link, Star 
} from 'lucide-react';

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    deployUrl: '',
    imageUrl: ''
  });

  const loadProjects = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.data);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  };

  useEffect(() => { loadProjects(); }, []);
  const handleToggleHighlight = async (proj: any) => {
    const highlightedCount = projects.filter((p: any) => p.isHighlighted).length;
    if (!proj.isHighlighted && highlightedCount >= 3) {
      alert("⚠️ Limite atingido! Você só pode destacar 3 projetos para exibição principal no dossiê.");
      return;
    }

    try {
      await api.patch(`/projects/${proj.id}/highlight`);
      loadProjects();
    } catch (error: any) {
      console.error("Erro ao processar destaque:", error.response?.data);
      alert("Erro ao processar destaque. Verifique se o backend está rodando.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await api.post('/projects/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, imageUrl: res.data.url });
    } catch (err) {
      alert("Erro ao subir imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.imageUrl) return alert("Título e Imagem são obrigatórios!");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t !== "")
      };
      await projectService.create(payload);
      setShowModal(false);
      setFormData({ title: '', description: '', technologies: '', githubUrl: '', deployUrl: '', imageUrl: '' });
      loadProjects();
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Módulos_Instalados</h2>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.4em] mt-2">Repositório de arquiteturas ativas</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl transition-all font-bold shadow-xl shadow-blue-900/20 group border border-blue-400/20"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="cursor-pointer tracking-widest text-sm">Criar</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((proj: any) => (
          <div 
            key={proj.id} 
            className="group relative bg-slate-900/20 border border-slate-800 hover:border-blue-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-3"
          >
            <div className="relative h-56 overflow-hidden m-3 rounded-xl border border-slate-800/50">
              <img 
                src={proj.imageUrl} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={proj.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full ${proj.isHighlighted ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' : 'bg-emerald-500'} animate-pulse`} />
                <span className="text-[10px] font-mono text-white tracking-[0.2em] font-bold uppercase">
                  {proj.isHighlighted ? 'Destaque' : 'Online'}
                </span>
              </div>
              <button 
                onClick={() => handleToggleHighlight(proj)}
                className={`cursor-pointer absolute top-3 right-3 z-30 p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                  proj.isHighlighted 
                  ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500 scale-110 shadow-lg shadow-yellow-500/10' 
                  : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                }`}
                title={proj.isHighlighted ? "Remover dos destaques" : "Destacar no perfil público"}
              >
                <Star size={18} fill={proj.isHighlighted ? "currentColor" : "none"} />
              </button>

              <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-sm">
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-3 bg-white text-slate-950 rounded-xl hover:scale-110 transition-transform shadow-2xl">
                    <Github size={20}/>
                  </a>
                )}
                {proj.deployUrl && (
                  <a href={proj.deployUrl} target="_blank" rel="noreferrer" className="p-3 bg-blue-600 text-white rounded-xl hover:scale-110 transition-transform shadow-2xl">
                    <ExternalLink size={20}/>
                  </a>
                )}
              </div>
            </div>

            <div className="px-7 pb-7 pt-2 flex flex-col flex-1">
              <h3 className="font-black text-2xl text-white mb-3 tracking-tighter group-hover:text-blue-400 transition-colors uppercase italic">
                {proj.title}
              </h3>
              
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl mb-6 flex-1 min-h-[80px]">
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 font-medium font-sans italic">
                  {proj.description || "// Sem documentação disponível para este módulo."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/50 pt-5">
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies?.slice(0, 3).map((t: string) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-800/50 text-slate-400 text-[9px] font-bold uppercase rounded border border-slate-700/50 tracking-tighter">
                      {t}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => confirm("Destruir módulo do sistema?") && projectService.delete(proj.id).then(loadProjects)} 
                  className="cursor-pointer text-slate-600 hover:text-red-500 transition-all p-2 hover:bg-red-500/5 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-3xl flex flex-col max-h-[95vh] overflow-hidden">
            
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h2 className="text-2xl font-bold text-white">Novo Projeto</h2>
                <p className="text-slate-400 text-sm">Preencha os detalhes da sua aplicação.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scroll space-y-8">
              <div className="space-y-4">
                <div className="relative group">
                  <Layout className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Nome do Projeto" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
                  />
                </div>
                <div className="relative group">
                  <AlignLeft className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <textarea 
                    placeholder="Descrição detalhada..." 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white h-32 resize-none outline-none focus:border-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <Code2 className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Techs (separadas por vírgula)" 
                    value={formData.technologies} 
                    onChange={e => setFormData({...formData, technologies: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
                  />
                </div>
                <div className="relative group">
                  <Link className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="URL do GitHub" 
                    value={formData.githubUrl} 
                    onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="relative flex flex-col items-center justify-center w-full h-48 bg-slate-950 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-[2.5rem] cursor-pointer overflow-hidden transition-all group">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-blue-500" size={32} />
                      <span className="text-blue-500 font-bold text-xs uppercase tracking-tighter">Subindo arquivo...</span>
                    </div>
                  ) : formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <ImageIcon size={30} className="text-slate-600" />
                      <span className="text-slate-500 text-sm font-medium">Clique para subir a capa</span>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
            </div>

            <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex gap-4">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
              >
                Descartar
              </button>
              <button 
                onClick={handleSave} 
                disabled={loading || uploading} 
                className="flex-2 p-4 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Publicar Projeto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};