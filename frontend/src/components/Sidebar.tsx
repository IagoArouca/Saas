import { LayoutDashboard, MessageSquare, Search, Settings, LogOut, Folder, UserCircle, Globe, BookOpen, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const Sidebar = () => {
  const { user, logout, hasUnreadMessages } = useAuthStore();

  const isDev = user?.role === 'DEV';
  const isRecruiter = user?.role === 'RECRUITER';
  const isCreator = user?.role === 'CONTENT_CREATOR';

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: isCreator ? '/dashboard/creator' : '/dashboard/dev',
      show: isDev || isCreator 
    },
    { 
      name: 'Buscar Talentos', 
      icon: Users, 
      path: '/dashboard/talentos', 
      show: isRecruiter 
    },
    { name: 'Meus Projetos', icon: Folder, path: '/dashboard/projects', show: isDev },
    { name: 'Trilha de Estudo', icon: BookOpen, path: '/dashboard/tracks', show: isDev },
    { 
      name: 'Mensagens', 
      icon: MessageSquare, 
      path: '/dashboard/chat', 
      show: isDev || isRecruiter 
    },
    { 
      name: isRecruiter ? 'Explorar Projetos' : 'Explorar projetos', 
      icon: Search, 
      path: '/dashboard/explore', 
      show: isDev || isRecruiter 
    },
    { 
      name: isRecruiter ? 'Meu Perfil Público' : 'Ver Perfil Público', 
      icon: Globe, 
      path: `/p/${user?.username}`,
      show: !!user?.username
    },
    { 
      name: 'Meu Perfil', 
      icon: UserCircle, 
      path: '/dashboard/profile',
      show: true 
    },
    { name: 'Configurações', icon: Settings, path: '/dashboard/settings', show: true },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-8 text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tighter">
        LuzNo Codigo
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.filter(item => item.show).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
              ${isActive 
                ? isRecruiter ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.name}</span>
            
            {item.name === 'Mensagens' && hasUnreadMessages && (
              <span className="absolute right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer">
          <LogOut size={20} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};