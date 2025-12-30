import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { WeeklyOrchestrator} from './pages/DevDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { PublicProfile } from './pages/PublicProfile';
import { Settings } from './pages/Settings';
import { Chat } from './pages/Chat';
import { ExploreProjects } from './pages/ExploreProjects'; 
import { ProjectsSection } from './components/ProjectsSection';

import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout'; 
import { SocketNotification } from './components/SocketNotification';
import { useAuthStore } from './store/useAuthStore';

export const App = () => {
  const { token } = useAuthStore();

  return (
    <HelmetProvider>
      <BrowserRouter>
        {token && <SocketNotification />}

        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route 
            path="/" 
            element={token ? <Navigate to="/dashboard/dev" /> : <LandingPage />} 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/p/:username" element={<PublicProfile />} />

          {/* ROTAS PROTEGIDAS */}
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/dashboard/dev" 
              element={<DashboardLayout><WeeklyOrchestrator /></DashboardLayout>} 
            />
            
            <Route 
              path="/dashboard/recruiter" 
              element={<DashboardLayout><RecruiterDashboard /></DashboardLayout>} 
            />
            
            <Route 
              path="/dashboard/projects" 
              element={
                <DashboardLayout>
                  <div className="p-8 max-w-7xl mx-auto w-full">
                    <ProjectsSection />
                  </div>
                </DashboardLayout>
              } 
            />

            <Route 
              path="/dashboard/explore" 
              element={<DashboardLayout><ExploreProjects /></DashboardLayout>} 
            />
            
            {/* ROTA MEU PERFIL: Agora usa o PublicProfile atualizado */}
            <Route 
              path="/dashboard/profile" 
              element={<DashboardLayout><PublicProfile /></DashboardLayout>} 
            />

            <Route 
              path="/dashboard/chat" 
              element={<DashboardLayout><Chat /></DashboardLayout>} 
            />
            
            <Route 
              path="/dashboard/settings" 
              element={<DashboardLayout><Settings /></DashboardLayout>} 
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;