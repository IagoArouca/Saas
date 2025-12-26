import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, Briefcase, PlayCircle, Clock, MessageSquare } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const menuItems = {
    DEV: [
      { label: 'Meu Perfil', icon: LayoutDashboard },
      { label: 'Projetos', icon: Briefcase },
      { label: 'Cronograma', icon: Clock },
    ],
    RECRUITER: [
      { label: 'Buscar Talentos', icon: LayoutDashboard },
      { label: 'Mensagens', icon: MessageSquare },
    ],
    CONTENT_CREATOR: [
      { label: 'Meus Vídeos', icon: PlayCircle },
      { label: 'Analytics', icon: LayoutDashboard },
    ],
  };

  const currentMenu = menuItems[user?.role || 'DEV'];

  return (
    <div className="flex h-screen bg-[#09090b] text-white">
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-10">
          Mochila do Dev
        </h1>
        
        <nav className="space-y-4 flex-1">
          {currentMenu.map((item) => (
            <div key={item.label} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-900 cursor-pointer transition-all text-slate-400 hover:text-white">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800 pt-6">
           <p className="text-sm font-semibold">{user?.email}</p>
           <span className="text-xs text-blue-500">{user?.role}</span>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};