import { Sidebar } from '../components/Sidebar';
import { useLocation } from 'react-router-dom';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isChatRoute = location.pathname === '/dashboard/chat';

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {isChatRoute ? (
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};