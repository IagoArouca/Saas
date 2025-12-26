import { useState, useEffect } from 'react';
import api from '../services/api';
import { Send } from 'lucide-react';

export const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');

  const loadChats = async () => {
    const res = await api.get('/chat/my-chats');
    setConversations(res.data);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    await api.post('/chat/send', { conversationId: selectedChat.id, content: message });
    setMessage('');
    loadChats(); 
  };

  useEffect(() => { loadChats(); }, []);

  return (
    <div className="h-[calc(100vh-120px)] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex">
      <div className="w-80 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 font-bold">Mensagens</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat: any) => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat)}
              className={`p-4 cursor-pointer hover:bg-slate-900 transition-all ${selectedChat?.id === chat.id ? 'bg-slate-900' : ''}`}
            >
              <p className="font-medium text-sm text-white">Chat com {chat.participants[0].email}</p>
              <p className="text-xs text-slate-500 truncate">{chat.messages[0]?.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#0b0b0d]">
        {selectedChat ? (
          <>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
            
              <div className="max-w-[70%] bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none self-end ml-auto">
                Olá! Vi seu projeto de NestJS e gostei muito.
              </div>
              <div className="max-w-[70%] bg-slate-800 text-white p-3 rounded-2xl rounded-tl-none">
                Muito obrigado! Estou focando bastante em arquitetura ultimamente.
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-800 flex gap-4">
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 outline-none focus:border-blue-500"
              />
              <button onClick={handleSend} className="p-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all">
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Selecione uma conversa para começar.
          </div>
        )}
      </div>
    </div>
  );
};