import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { FocusProvider } from './contexts/FocusContext';
import api from './services/api';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { WeeklyOrchestrator } from './pages/DevDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { CreatorDashboard } from './pages/CreatorDashboard'; 
import { PublicProfile } from './pages/PublicProfile';
import { PerfilPublicoRecruiter } from './pages/PerfilPublicoRecruiter';
import { Settings } from './pages/Settings';
import { SettingsRecruiter } from './pages/SettingsRecruiter';
import { Chat } from './pages/Chat';
import { ExploreProjects } from './pages/ExploreProjects'; 
import { StudyTracks } from './pages/StudyTracks';
import { MyVideos } from './pages/MyVideos';
import { ArchiveProjects } from './pages/ArchiveProjects';

// Components & Layouts
import { ProjectsSection } from './components/ProjectsSection';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import { SocketNotification } from './components/SocketNotification';

const PublicProfileResolver = () => {
  const { username } = useParams();
  const { user: loggedUser } = useAuthStore();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const identifyProfile = async () => {
      if (!username) {
        if (loggedUser) setRole(loggedUser.role);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await api.get(`/profiles/public/${username}`);
        const apiRole = res.data.role || res.data.user?.role || res.data.profile?.user?.role;
        
        if (apiRole === 'RECRUITER' || username.toLowerCase().includes('recruiter')) {
          setRole('RECRUITER');
        } else {
          setRole('DEV');
        }
      } catch (err) {
        setRole(username.toLowerCase().includes('recruiter') ? 'RECRUITER' : 'DEV');
      } finally {
        setLoading(false);
      }
    };
    identifyProfile();
  }, [username, loggedUser]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );

  return role === 'RECRUITER' ? <PerfilPublicoRecruiter /> : <PublicProfile />;
};

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
            {/* Rotas Públicas */}
            <Route path="/" element={token ? <Navigate to={getRedirectPath()} replace /> : <LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/p/:username" element={<PublicProfileResolver />} />
            
            {/* ROTA DO ARQUIVO (PÚBLICA) */}
            <Route path="/p/:username/archive" element={<ArchiveProjects />} />

            {/* Rotas Privadas (Dashboard) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/dev" element={<DashboardLayout><WeeklyOrchestrator /></DashboardLayout>} />
              <Route path="/dashboard/recruiter" element={<DashboardLayout><RecruiterDashboard /></DashboardLayout>} />
              <Route path="/dashboard/creator" element={<DashboardLayout><CreatorDashboard /></DashboardLayout>} />
              
              <Route path="/dashboard/projects" element={<DashboardLayout><div className="py-8"><ProjectsSection /></div></DashboardLayout>} />
              
              <Route path="/dashboard/explore" element={<DashboardLayout><ExploreProjects /></DashboardLayout>} />
              
              {/* ROTA DA TRILHA - AJUSTADA PARA /tracks */}
              <Route path="/dashboard/tracks" element={<DashboardLayout><StudyTracks /></DashboardLayout>} />
              
              <Route path="/dashboard/my-videos" element={<DashboardLayout><MyVideos /></DashboardLayout>} />
              <Route path="/dashboard/chat" element={<DashboardLayout><Chat /></DashboardLayout>} />
              <Route path="/dashboard/profile" element={<DashboardLayout><PublicProfileResolver /></DashboardLayout>} />

              <Route path="/dashboard/settings" element={
                <DashboardLayout>
                  {user?.role === 'RECRUITER' ? <SettingsRecruiter /> : <Settings />}
                </DashboardLayout>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FocusProvider>
    </HelmetProvider>
  );
};

export default App;