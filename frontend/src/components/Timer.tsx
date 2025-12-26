import { useState, useEffect } from 'react';

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
    } else if (minutes === 0 && seconds === 0) {
      setIsActive(false);
      alert("Ciclo concluído! Hora de um café.");
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-6xl font-mono font-bold tabular-nums mb-8 tracking-tighter">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`px-8 py-3 rounded-full font-bold transition-all ${
          isActive 
          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
          : 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
        }`}
      >
        {isActive ? 'Pausar' : 'Iniciar Foco'}
      </button>
    </div>
  );
};