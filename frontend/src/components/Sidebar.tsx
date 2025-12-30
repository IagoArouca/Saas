import { 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  Settings, 
  LogOut, 
  Folder, 
  UserCircle 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const Sidebar = () => {
  const { user, logout, hasUnreadMessages, setHasUnreadMessages } = useAuthStore();

  // Definimos os itens do menu
  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: user?.role === 'DEV' ? '/dashboard/dev' : '/dashboard/recruiter' 
    },
    { 
      name: 'Projetos', 
      icon: Folder, 
      path: '/dashboard/projects',
      // Exibe apenas para DEVs ou remova a linha abaixo para exibir para todos
      show: user?.role === 'DEV' 
    },
    { 
      name: 'Explorar', 
      icon: Search, 
      path: '/dashboard/explore', 
      show: true // Agora visível para todos os cargos
    },
    { 
      name: 'Mensagens', 
      icon: MessageSquare, 
      path: '/dashboard/chat', 
      badge: hasUnreadMessages 
    },
    { 
      name: 'Meu Perfil', 
      icon: UserCircle, 
      path: '/dashboard/profile' 
    },
    { 
      name: 'Ajustes', 
      icon: Settings, 
      path: '/dashboard/settings' 
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-8 text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        Mochila.dev
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {/* Filtramos os itens que têm permissão de aparecer */}
        {menuItems.filter(item => item.show !== false).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => item.name === 'Mensagens' && setHasUnreadMessages(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.name}</span>
            
            {/* Indicador de Mensagens não lidas */}
            {item.badge && (
              <span className="absolute right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Botão de Sair */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};