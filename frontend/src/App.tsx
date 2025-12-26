import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { DevDashboard } from './pages/DevDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['DEV']} />}>
          <Route path="/dashboard/dev" element={<DevDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
          <Route path="/dashboard/recruiter" element={<h1>Busca de Talentos</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};