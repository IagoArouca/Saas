import { Play, Coffee, CheckCircle, Clock, Pause } from 'lucide-react';
import { useState } from 'react';
import { Timer } from '../components/Timer'; 

export const DevDashboard = () => {
  const [isFocusing, setIsFocusing] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-500">
      
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <header>
          <h1 className="text-2xl font-bold italic">Boa jornada, <span className="text-blue-500">Dev</span></h1>
          <p className="text-slate-400">Aqui está o seu plano de voo para hoje.</p>
        </header>

        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock size={18} className="text-blue-400" /> Cronograma Semanal
            </h2>
            <button className="text-[10px] font-bold uppercase tracking-wider bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all">
              Editar Grade
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map(dia => (
              <div key={dia} className="space-y-3">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{dia}</span>
                <div className="h-24 bg-slate-950/50 border border-slate-800/50 rounded-xl p-3 text-xs hover:border-blue-500/40 hover:bg-slate-900/50 transition-all cursor-pointer group">
                  <p className="text-blue-400 font-bold group-hover:text-blue-300 transition-colors">09:00 - NestJS</p>
                  <p className="text-slate-500 mt-1 leading-relaxed">Módulos e Auth</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-gradient-to-b from-slate-900 to-black border border-slate-800 rounded-[2.5rem] p-8 sticky top-6 shadow-2xl">
          <h3 className="text-center text-slate-500 text-[10px] font-black mb-8 uppercase tracking-[0.3em]">Modo Foco</h3>
          
          <Timer /> 

          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={() => setIsFocusing(!isFocusing)}
              className={`p-4 rounded-full transition-all ${isFocusing ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'}`}
            >
              {isFocusing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            
            <button className="p-4 bg-slate-800 text-slate-400 rounded-full hover:text-orange-400 hover:bg-orange-400/10 transition-all" title="Intervalo">
              <Coffee size={24} />
            </button>

            <button className="p-4 bg-slate-800 text-slate-400 rounded-full hover:text-emerald-400 hover:bg-emerald-400/10 transition-all" title="Concluir Ciclo">
              <CheckCircle size={24} />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="text-center p-5 bg-slate-950/50 rounded-3xl border border-slate-800/50">
              <p className="text-2xl font-black text-white">4</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Ciclos Hoje</p>
            </div>
            <div className="text-center p-5 bg-slate-950/50 rounded-3xl border border-slate-800/50">
              <p className="text-2xl font-black text-blue-500">120</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Minutos</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};