import { Play, Coffee, CheckCircle, Clock } from 'lucide-react';
import { Timer } from '../components/Timer'; 
export const DevDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      
      <div className="col-span-8 space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Boa jornada, <span className="text-blue-500">Dev</span></h1>
          <p className="text-slate-400">Aqui está o seu plano de voo para hoje.</p>
        </header>

        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock size={18} className="text-blue-400" /> Cronograma Semanal
            </h2>
            <button className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-600/30 hover:bg-blue-600 hover:text-white transition-all">
              Editar Grade
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map(dia => (
              <div key={dia} className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{dia}</span>
                <div className="h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs hover:border-blue-500/50 transition-colors cursor-pointer">
                  <p className="text-blue-400 font-medium">09:00 - NestJS</p>
                  <p className="text-slate-500 mt-1">Módulos e Auth</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="col-span-4 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sticky top-6">
          <h3 className="text-center text-slate-400 text-sm font-medium mb-4 uppercase tracking-tighter">Modo Foco</h3>
          
          <Timer /> 

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <p className="text-2xl font-bold">4</p>
              <p className="text-[10px] text-slate-500 uppercase">Ciclos Hoje</p>
            </div>
            <div className="text-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <p className="text-2xl font-bold text-blue-500">120</p>
              <p className="text-[10px] text-slate-500 uppercase">Minutos</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};