import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, MessageSquare, Loader2, User, Search, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useAuthStore } from '../store/useAuthStore';
import { chatService } from '../services/chatService';

export const Chat = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const [isExiting, setIsExiting] = useState(false); 

  const otherUser = activeChat?.temp 
    ? activeChat.otherUser 
    : activeChat?.users?.find((u: any) => u.id !== user?.id);

  const loadConversations = async () => {
    try {
      const res = await chatService.getMyChats();
      setConversations(res.data);
      if (targetIdFromUrl) {
        const existing = res.data.find((c: any) => c.users.some((u: any) => u.id === targetIdFromUrl));
        if (existing) {
          setActiveChat(existing);
          setMessages(existing.messages || []);
        } else if (targetNameFromUrl) {
          setActiveChat({ 
            id: null, temp: true, 
            otherUser: { id: targetIdFromUrl, profile: { username: targetNameFromUrl } } 
          });
          setMessages([]);
        }
      }
    } catch (err) { console.error("Erro", err); } 
    finally { setFetchingChats(false); }
  };

  useEffect(() => { loadConversations(); }, [targetIdFromUrl]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleViewProfile = () => {
    if (!otherUser?.profile?.username) return;
    setIsExiting(true);
    setTimeout(() => {
      navigate(`/p/${otherUser.profile.username}`);
    }, 400);
  };

  const handleSend = async () => {
    if (!text.trim() || !user || !activeChat) return;
    try {
      setLoading(true);
      const isNewChat = !activeChat.id;
      const payload = isNewChat 
        ? { content: text, receiverId: activeChat.otherUser?.id || targetIdFromUrl }
        : { content: text, conversationId: activeChat.id };
      const res = await chatService.sendMessage(payload as any);
      const newMessage = { id: res.data.id, content: text, senderId: user.id, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, newMessage]);
      setText('');
      if (isNewChat) await loadConversations();
    } catch (err: any) { alert(err.response?.data?.message || "Erro"); } 
    finally { setLoading(false); }
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={isExiting ? { opacity: 0, scale: 0.95, filter: 'blur(10px)' } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full w-full bg-slate-950 text-white border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="w-80 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-900/40">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-100">
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
          {filteredConversations.map((chat) => {
            const other = chat.users.find((u: any) => u.id !== user?.id);
            const isSelected = activeChat?.id === chat.id;
            return (
              <button
                key={chat.id}
                onClick={() => {
                  setActiveChat(chat);
                  setMessages(chat.messages || []);
                  setSearchParams({ targetId: other.id, targetName: other.profile?.username || 'Usuário' });
                }}
                className={`cursor-pointer w-full p-4 flex items-center gap-3 border-b border-slate-800/30 transition-all hover:bg-slate-800/40 ${isSelected ? 'bg-blue-600/10 border-r-2 border-r-blue-500' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                   {other?.profile?.avatar ? <img src={other.profile.avatar} className="w-full h-full object-cover" /> : <User size={24} className="text-slate-400" />}
                </div>
                <div className="text-left flex-1">
                  <p className={`font-bold text-sm truncate ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>{other?.profile?.username}</p>
                  <p className="text-xs text-slate-500 truncate">{chat.messages?.[chat.messages.length - 1]?.content || '...'}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f1a]">
        {activeChat ? (
          <>
            <header className="h-[73px] px-6 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                   {otherUser?.profile?.avatar ? <img src={otherUser.profile.avatar} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-400" />}
                </div>
                <div>
                  <p className="text-slate-100 font-bold leading-none mb-1">{otherUser?.profile?.username || 'Usuário'}</p>
                  <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest animate-pulse">Online</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewProfile}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-blue-500/5 cursor-pointer"
              >
                <ExternalLink size={14} />
                Ver perfil
              </motion.button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <motion.div 
                      key={msg.id || i}
                      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={scrollRef} />
            </main>

            <footer className="p-4 bg-slate-900/60 border-t border-slate-800">
              <div className="flex gap-3 max-w-5xl mx-auto">
                <input 
                  value={text} 
                  onChange={e => setText(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3 outline-none focus:border-blue-500 transition-all text-sm" 
                  placeholder="Digitar mensagem..."
                />
                <button onClick={handleSend} disabled={loading || !text.trim()} className="cursor-pointer bg-blue-600 p-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                  {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-950/40">
             <MessageSquare size={32} className="opacity-20 mb-4" />
             <p className="font-medium tracking-wide">Selecione uma conversa</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};