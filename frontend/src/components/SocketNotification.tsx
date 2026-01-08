import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const SocketNotification = () => {
  const [notification, setNotification] = useState<any>(null);
  const { user, token, setHasUnreadMessages } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;

    const socket = io('http://localhost:3000', {
      query: { userId: user?.id }
    });

    socket.on('newMessage', (data) => {
      if (location.pathname !== '/dashboard/chat') {
        setNotification(data);
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => console.log("Áudio bloqueado"));
      }
    });

    return () => { socket.disconnect(); };
  }, [token, location.pathname, user?.id]);

  const handleAction = (action: 'now' | 'later') => {
    if (action === 'now') {
      navigate('/dashboard/chat');
    } else {
      setHasUnreadMessages(true); 
    }
    setNotification(null);
  };

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-5 animate-in slide-in-from-right-10 z-[100] backdrop-blur-xl">
      <div className="flex gap-4">
        <div className="bg-blue-600/20 p-2 h-fit rounded-lg">
          <MessageSquare className="text-blue-500" size={20} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nova Conversa</p>
          <p className="text-sm text-white mt-1 leading-snug">
            <span className="font-bold">{notification.senderName}</span> enviou uma mensagem.
          </p>
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => handleAction('now')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-all"
            >
              Agora
            </button>
            <button 
              onClick={() => handleAction('later')}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-lg transition-all"
            >
              Depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};