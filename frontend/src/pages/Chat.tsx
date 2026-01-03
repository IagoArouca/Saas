import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageSquare, Loader2, User, Search } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { chatService } from '../services/chatService';

export const Chat = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  const targetIdFromUrl = searchParams.get('targetId');
  const targetNameFromUrl = searchParams.get('targetName');

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingChats, setFetchingChats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadConversations = async () => {
    try {
      const res = await chatService.getMyChats();
      setConversations(res.data);

      if (targetIdFromUrl) {
        const existing = res.data.find((c: any) => 
          c.users.some((u: any) => u.id === targetIdFromUrl)
        );
        if (existing) {
          setActiveChat(existing);
          setMessages(existing.messages || []);
        } else if (targetNameFromUrl) {
          setActiveChat({ 
            id: null, 
            temp: true, 
            otherUser: { id: targetIdFromUrl, profile: { username: targetNameFromUrl } } 
          });
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar conversas", err);
    } finally {
      setFetchingChats(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [targetIdFromUrl]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !user || !activeChat) return;
    try {
      setLoading(true);
      const isNewChat = !activeChat.id;
      
      const payload = isNewChat 
        ? { content: text, receiverId: activeChat.otherUser?.id || targetIdFromUrl }
        : { content: text, conversationId: activeChat.id };

      const res = await chatService.sendMessage(payload as any);
      
      const newMessage = {
        id: res.data.id,
        content: text,
        senderId: user.id,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMessage]);
      setText('');

      if (isNewChat) await loadConversations();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao enviar");
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(c => {
    const other = c.users.find((u: any) => u.id !== user?.id);
    return other?.profile?.username?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (fetchingChats) return (
    <div className="h-full w-full flex items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="flex h-full w-full bg-slate-950 text-white border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* COLUNA ESQUERDA: LISTA DE CONVERSAS */}
      <div className="w-80 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-900/40">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <MessageSquare size={22} className="text-blue-500" />
            Chats
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text"
              placeholder="Buscar conversa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConversations.length === 0 && !activeChat?.temp ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500 italic">Nenhuma conversa encontrada.</p>
            </div>
          ) : (
            filteredConversations.map((chat) => {
              const otherUser = chat.users.find((u: any) => u.id !== user?.id);
              const isSelected = activeChat?.id === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat);
                    setMessages(chat.messages || []);
                    setSearchParams({ targetId: otherUser.id, targetName: otherUser.profile?.username || 'Usuário' });
                  }}
                  className={`w-full p-4 flex items-center gap-3 border-b border-slate-800/30 transition-all hover:bg-slate-800/40 ${isSelected ? 'bg-blue-600/10 border-r-2 border-r-blue-500' : ''}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                      {otherUser?.profile?.avatar ? <img src={otherUser.profile.avatar} className="w-full h-full object-cover" /> : <User size={24} className="text-slate-400" />}
                    </div>
                  </div>
                  <div className="text-left overflow-hidden flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className={`font-bold text-sm truncate ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                        {otherUser?.profile?.username || 'Usuário'}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {chat.messages?.[chat.messages.length - 1]?.content || 'Inicie a conversa...'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* COLUNA DIREITA: JANELA DE MENSAGENS */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f1a]">
        {activeChat ? (
          <>
            <header className="h-[73px] px-6 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                  { (activeChat.otherUser?.profile?.avatar || activeChat.users?.find((u:any)=>u.id !== user?.id)?.profile?.avatar) ? 
                    <img src={activeChat.otherUser?.profile?.avatar || activeChat.users?.find((u:any)=>u.id !== user?.id)?.profile?.avatar} className="w-full h-full object-cover" /> 
                    : <User size={20} className="text-slate-400" />
                  }
                </div>
                <div>
                  <p className="text-slate-100 font-bold leading-none mb-1">
                    {activeChat.otherUser?.profile?.username || activeChat.users?.find((u: any) => u.id !== user?.id)?.profile?.username || 'Usuário'}
                  </p>
                  <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest">Online</p>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20 custom-scrollbar">
              {messages.map((msg, i) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' 
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </main>

            <footer className="p-4 bg-slate-900/60 border-t border-slate-800">
              <div className="flex gap-3 max-w-5xl mx-auto">
                <input 
                  value={text} 
                  onChange={e => setText(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm" 
                  placeholder="Escreva sua mensagem aqui..."
                />
                <button 
                  onClick={handleSend} 
                  disabled={loading || !text.trim()} 
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 p-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-blue-900/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-950/40">
            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-800">
              <MessageSquare size={32} className="opacity-20" />
            </div>
            <p className="font-medium tracking-wide">Selecione uma transmissão para descriptografar</p>
            <p className="text-xs opacity-40 mt-1 uppercase font-mono tracking-tighter text-blue-500">Mochila_Dev Chat v1.0</p>
          </div>
        )}
      </div>
    </div>
  );
};