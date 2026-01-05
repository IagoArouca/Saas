import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Contexts
import { FocusProvider } from './contexts/FocusContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { WeeklyOrchestrator } from './pages/DevDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { CreatorDashboard } from './pages/CreatorDashboard'; 
import { MyVideos } from './pages/MyVideos'; 
import { PublicProfile } from './pages/PublicProfile';
import { PerfilPublicoRecruiter} from './pages/PerfilPublicoRecruiter';
import { ArchiveProjects } from './pages/ArchiveProjects'; 
import { Settings } from './pages/Settings';
import { SettingsRecruiter } from './pages/SettingsRecruiter';
import { Chat } from './pages/Chat';
import { ExploreProjects } from './pages/ExploreProjects'; 
import { StudyTracks } from './pages/StudyTracks';

// Components & Layouts
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout'; 
import { ProjectsSection } from './components/ProjectsSection';
import { SocketNotification } from './components/SocketNotification';
import { useAuthStore } from './store/useAuthStore';

export const App = () => {
  const { token, user } = useAuthStore();

  const getRedirectPath = () => {
    if (user?.role === 'CONTENT_CREATOR') return "/dashboard/creator";
    if (user?.role === 'RECRUITER') return "/dashboard/recruiter";
    return "/dashboard/dev";
  };

  return (
    <HelmetProvider>
      <FocusProvider>
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
            
            {/* Perfil Público Dinâmico */}
            <Route 
              path="/p/:username" 
              element={user?.role === 'RECRUITER' ? <PerfilPublicoRecruiter /> : <PublicProfile />} 
            />
            
            <Route path="/archive/:username" element={<ArchiveProjects />} />

            {/* ROTAS PROTEGIDAS */}
            <Route element={<ProtectedRoute />}>
              
              <Route 
                path="/dashboard/creator" 
                element={<DashboardLayout><CreatorDashboard /></DashboardLayout>} 
              />

              <Route 
                path="/dashboard/my-videos" 
                element={<DashboardLayout><MyVideos /></DashboardLayout>} 
              />

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
              
              <Route 
                path="/dashboard/profile" 
                element={
                  <DashboardLayout>
                    {user?.role === 'RECRUITER' ? <PerfilPublicoRecruiter /> : <PublicProfile />}
                  </DashboardLayout>
                } 
              />

              <Route 
                path="/dashboard/chat" 
                element={<DashboardLayout><Chat /></DashboardLayout>} 
              />
              
              <Route 
                path="/dashboard/settings" 
                element={
                  <DashboardLayout>
                    {user?.role === 'RECRUITER' ? <SettingsRecruiter /> : <Settings />}
                  </DashboardLayout>
                } 
              />

              <Route 
                path="/dashboard/study-tracks" 
                element={<DashboardLayout><StudyTracks /></DashboardLayout>} 
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FocusProvider>
    </HelmetProvider>
  );
};

export default App;