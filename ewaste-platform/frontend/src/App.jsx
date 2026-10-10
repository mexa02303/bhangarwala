import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import AgentLayout from './layouts/AgentLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import EWasteGuidePage from './pages/EWasteGuidePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User Pages
import UserDashboard from './pages/UserDashboard';
import SubmitEWastePage from './pages/SubmitEWastePage';
import MyCasesPage from './pages/MyCasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCasesPage from './pages/admin/AdminCasesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAgentsPage from './pages/admin/AdminAgentsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/ewaste-guide" element={<EWasteGuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Customer User Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'agent']}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/submit-ewaste" element={<SubmitEWastePage />} />
          <Route path="/my-cases" element={<MyCasesPage />} />
          <Route path="/my-cases/:id" element={<CaseDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cases" element={<AdminCasesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/agents" element={<AdminAgentsPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        </Route>

        {/* Field Agent Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['agent', 'admin']}>
              <AgentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
