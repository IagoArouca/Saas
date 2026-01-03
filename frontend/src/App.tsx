import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { WeeklyOrchestrator } from './pages/DevDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { CreatorDashboard } from './pages/CreatorDashboard'; // Certifique-se de criar este arquivo
import { MyVideos } from './pages/MyVideos'; // Certifique-se de criar este arquivo
import { PublicProfile } from './pages/PublicProfile';
import { ArchiveProjects } from './pages/ArchiveProjects'; 
import { Settings } from './pages/Settings';
import { Chat } from './pages/Chat';
import { ExploreProjects } from './pages/ExploreProjects'; 
import { ProjectsSection } from './components/ProjectsSection';
import { StudyTracks } from './pages/StudyTracks';

import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout'; 
import { SocketNotification } from './components/SocketNotification';
import { useAuthStore } from './store/useAuthStore';

export const App = () => {
  const { token, user } = useAuthStore();

  // Função para determinar para onde enviar o usuário ao logar ou acessar a raiz
  const getRedirectPath = () => {
    if (user?.role === 'CONTENT_CREATOR') return "/dashboard/creator";
    if (user?.role === 'RECRUITER') return "/dashboard/recruiter";
    return "/dashboard/dev";
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        {token && <SocketNotification />}

        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route 
            path="/" 
            element={token ? <Navigate to={getRedirectPath()} replace /> : <LandingPage />} 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/p/:username" element={<PublicProfile />} />
          <Route path="/archive/:username" element={<ArchiveProjects />} />

          {/* ROTAS PROTEGIDAS */}
          <Route element={<ProtectedRoute />}>
            
            {/* DASHBOARD EXCLUSIVO YOUTUBER/CREATOR */}
            <Route 
              path="/dashboard/creator" 
              element={<DashboardLayout><CreatorDashboard /></DashboardLayout>} 
            />

            <Route 
              path="/dashboard/my-videos" 
              element={<DashboardLayout><MyVideos /></DashboardLayout>} 
            />

            {/* DASHBOARD DEV */}
            <Route 
              path="/dashboard/dev" 
              element={<DashboardLayout><WeeklyOrchestrator /></DashboardLayout>} 
            />
            
            {/* DASHBOARD RECRUITER */}
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
          <Route 
              path="/dashboard/study-tracks" 
              element={<DashboardLayout><StudyTracks /></DashboardLayout>} 
            />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;