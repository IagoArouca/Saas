import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudioNotification } from '../hooks/useAudioNotification'; 

interface FocusContextData {
  timeLeft: number;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
}

const FocusContext = createContext<FocusContextData>({} as FocusContextData);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Configurado para 50 minutos
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isActive, setIsActive] = useState(false);
  
  const { playNotification } = useAudioNotification();

  useEffect(() => {
    let interval: any;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playNotification();
      setTimeout(() => {
        playNotification();
      }, 1500);
      
      alert("Sessão de Foco Finalizada!");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, playNotification]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(50 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <FocusContext.Provider value={{ timeLeft, isActive, setIsActive, resetTimer, formatTime }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus deve ser usado dentro de um FocusProvider');
  }
  return context;
};