import { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { Plus, Github, ExternalLink, Trash2 } from 'lucide-react';

export const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadProjects = async () => {
    const res = await projectService.getAll();
    setProjects(res.data);
  };

  useEffect(() => { loadProjects(); }, []);

  return (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Meus Projetos</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-xl transition-all"
        >
          <Plus size={18} /> Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj: any) => (
          <div key={proj.id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition-all group">
            <h3 className="font-bold text-lg mb-2">{proj.title}</h3>
            <p className="text-slate-400 text-sm line-clamp-2 mb-4">{proj.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {proj.technologies.map((tech: string) => (
                <span key={tech} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md">{tech}</span>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <div className="flex gap-3">
                <a href={proj.githubUrl} target="_blank" className="text-slate-400 hover:text-white"><Github size={18}/></a>
                <a href={proj.deployUrl} target="_blank" className="text-slate-400 hover:text-white"><ExternalLink size={18}/></a>
              </div>
              <button 
                onClick={() => projectService.delete(proj.id).then(loadProjects)}
                className="text-slate-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">Adicionar Projeto</h2>
           
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 p-3 rounded-xl bg-slate-800">Cancelar</button>
              <button className="flex-1 p-3 rounded-xl bg-blue-600 font-bold">Salvar Projeto</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};