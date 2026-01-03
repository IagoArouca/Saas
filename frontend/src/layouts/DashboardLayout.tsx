import { Sidebar } from '../components/Sidebar';
import { useLocation } from 'react-router-dom';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Chat precisa ocupar a tela inteira
  const isChatRoute = location.pathname === '/dashboard/chat';

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Área principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {isChatRoute ? (
          // 🔥 CHAT SEM PADDING E SEM SCROLL PAI
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        ) : (
          // 🔹 Demais páginas continuam normais
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};