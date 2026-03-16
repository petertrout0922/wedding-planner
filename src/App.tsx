import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { ResetPasswordRequest } from './pages/ResetPasswordRequest';
import { TermsOfService } from './pages/TermsOfService';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Settings } from './pages/Settings';
import { Budget } from './pages/Budget';
import { Vendors } from './pages/Vendors';
import { Guests } from './pages/Guests';
import { Help } from './pages/Help';
import ColorSamples from './pages/ColorSamples';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/color-samples" element={<ColorSamples />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
