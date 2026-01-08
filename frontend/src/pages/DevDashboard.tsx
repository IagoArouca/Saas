import { useState, useEffect } from 'react';
import api from '../services/api'; 
import { useFocus } from '../contexts/FocusContext'; 
import { 
  Calendar, Clock, Zap, Play, Square, 
  RefreshCcw, Edit3, Save, Terminal, Trash2, Loader2
} from 'lucide-react';

const initialSchedule = [
  { id: 'SEG', name: 'Segunda', tasks: ['Frontend', 'React', 'Tailwind', 'API'], color: 'from-blue-500' },
  { id: 'TER', name: 'Terça', tasks: ['Backend', 'NodeJS', 'Prisma', 'SQL'], color: 'from-purple-500' },
  { id: 'QUA', name: 'Quarta', tasks: ['DevOps', 'Docker', 'AWS', 'CI/CD'], color: 'from-amber-500' },
  { id: 'QUI', name: 'Quinta', tasks: ['Testes', 'Jest', 'Cypress', 'Bugs'], color: 'from-emerald-500' },
  { id: 'SEX', name: 'Sexta', tasks: ['SoftSkill', 'Gestão', 'Review', 'Planos'], color: 'from-rose-500' },
];

export const WeeklyOrchestrator = () => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { timeLeft, isActive, setIsActive, resetTimer, formatTime } = useFocus();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.get('/schedule/my-schedule');
        if (res.data && res.data.length > 0) {
          const dbData = res.data;
          const mappedSchedule = initialSchedule.map((day, index) => {
            const serverDay = dbData.find((item: any) => item.dayOfWeek === index);
            return {
              ...day,
              tasks: serverDay ? serverDay.subject.split(',') : ['', '', '', '']
            };
          });
          setSchedule(mappedSchedule);
        }
      } catch (err) {
        console.error("Erro ao buscar cronograma:", err);
      }
    };
    fetchSchedule();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const savePromises = schedule.map((day, index) => {
        return api.post('/schedule/block', {
          dayOfWeek: index,
          subject: day.tasks.join(','),
          startTime: "00:00",
          endTime: "00:00"
        });
      });

      await Promise.all(savePromises);
      setIsEditing(false);
      alert("Cronograma sincronizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Falha ao salvar no banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskChange = (dayId: string, taskIndex: number, newValue: string) => {
    setSchedule(schedule.map(day => {
      if (day.id === dayId) {
        const newTasks = [...day.tasks];
        newTasks[taskIndex] = newValue.slice(0, 20);
        return { ...day, tasks: newTasks };
      }
      return day;
    }));
  };

  const clearSchedule = () => {
    if (confirm("Deseja limpar todas as disciplinas do cronograma?")) {
      setSchedule(schedule.map(day => ({ ...day, tasks: ['', '', '', ''] })));
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20 animate-in fade-in duration-1000">
      <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30">
            <Terminal className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight italic">MODO FOCO</h2>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest text-blue-400">Trabalho Profundo</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-6xl font-black text-white font-mono tracking-tighter tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <div className="w-48 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              style={{ width: `${(timeLeft / (25 * 60)) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end gap-3">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`cursor-pointer p-4 rounded-xl flex items-center gap-2 font-bold transition-all ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950 hover:scale-105'}`}
          >
            {isActive ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            {isActive ? 'PARAR' : 'INICIAR'}
          </button>
          <button 
            onClick={resetTimer}
            className="cursor-pointer p-4 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">CRONOGRAMA SEMANAL</h2>
          <p className="text-slate-500 text-xs font-mono uppercase mt-1 tracking-[0.4em]">Orquestração de Sprints Diários</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={clearSchedule}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
          >
            <Trash2 size={18} />
            LIMPAR
          </button>

          <button 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={loading}
            className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-xl ${isEditing ? 'bg-emerald-600 text-white shadow-emerald-900/20' : 'bg-blue-600 text-white shadow-blue-900/20'}`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? <Save size={18} /> : <Edit3 size={18} />)}
            {loading ? 'SALVANDO...' : (isEditing ? 'CONFIRMAR' : 'EDITAR CRONOGRAMA')}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {schedule.map((day) => (
          <div 
            key={day.id} 
            className="group bg-slate-900/20 border border-slate-800 p-5 rounded-2xl hover:bg-slate-900/40 transition-all duration-500"
          >
            <div className={`w-12 h-1.5 rounded-full bg-gradient-to-r ${day.color} to-transparent mb-6`} />
            
            <span className="text-[10px] font-mono font-bold text-slate-600 tracking-[0.3em] uppercase block mb-1">
              {day.id}_STATUS
            </span>
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter italic">{day.name}</h3>

            <div className="space-y-3">
              {day.tasks.map((task, index) => (
                <div key={index} className="relative">
                  {isEditing ? (
                    <input 
                      type="text"
                      value={task}
                      placeholder="..."
                      onChange={(e) => handleTaskChange(day.id, index, e.target.value)}
                      className="w-full bg-slate-950 border border-blue-500/50 p-3 rounded-lg text-blue-400 font-bold uppercase tracking-tighter outline-none text-[10px] focus:border-blue-500 transition-all"
                    />
                  ) : (
                    <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 group-hover:border-slate-700 transition-colors h-[40px] flex items-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">
                        {task || <span className="opacity-10">—</span>}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};