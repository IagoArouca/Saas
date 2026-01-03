import { useState, useEffect } from 'react';
import api from '../services/api';

export const Timer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      setIsActive(false);
      
      // SALVAR SESSÃO DE FOCO NO BANCO
      api.post('/productivity/log-session', {
        duration: 25,
        subject: "Foco Mochila_Dev"
      })
      .then(() => alert("Ciclo concluído! Estatística de estudo salva."))
      .catch(() => console.error("Erro ao persistir sessão de foco"));
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  return (
    <div className="flex flex-col items-center p-8 bg-slate-900/40 rounded-3xl border border-white/5">
      <div className="text-7xl font-mono font-bold tabular-nums mb-8 tracking-tighter text-blue-500">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
          isActive 
          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
          : 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500'
        }`}
      >
        {isActive ? 'Pausar' : 'Iniciar Foco'}
      </button>
    </div>
  );
};