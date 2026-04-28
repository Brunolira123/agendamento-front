import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientesList from './components/clientes/ClientesList';
import ClienteForm from './components/clientes/ClienteForm';
import ErrorBoundary from './components/ErrorBoundary';
import NovoAgendamento from './pages/NovoAgendamento';
import ProfissionaisList from './components/profissionais/ProfissionaisList';
import ProfissionalForm from './components/profissionais/ProfissionalForm';
import ServicosList from './components/servicos/ServicosList';
import ServicoForm from './components/servicos/ServicoForm';
import Cadastro from './pages/Cadastro';
import LandingPage from './pages/LandingPage';
import Planos from './pages/Planos';
import AdminDashboard from './pages/admin/AdminDashboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Componente de rota privada
function PrivateRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');
  const usuarioStorage = localStorage.getItem('usuario');
  
  if (!token || !usuarioStorage) {
    console.log('🔒 PrivateRoute: Sem token ou usuário, redirecionando para login');
    return <Navigate to="/login" replace />;
  }
  
  // Verificar se precisa ser admin
  if (requireAdmin) {
    try {
      const usuario = JSON.parse(usuarioStorage);
      if (usuario.papel !== 'ADMIN') {
        console.log('❌ Acesso negado: usuário não é admin', usuario.papel);
        return <Navigate to="/dashboard" replace />;
      }
      console.log('✅ Acesso admin permitido para:', usuario.email);
    } catch (e) {
      console.error('Erro ao parse usuarioStorage:', e);
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
}

// Componente de rota pública
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (token) {
    console.log('🔒 PublicRoute: Usuário já logado, redirecionando');
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/" element={<LandingPage />} />
      <Route path="/planos" element={<Planos />} />
      <Route path="/cadastro" element={
        <PublicRoute>
          <Cadastro />
        </PublicRoute>
      } />
      
      {/* Rotas Privadas - Dashboard */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      
      {/* Rotas Privadas - Admin (requer papel ADMIN) */}
      <Route path="/admin" element={
        <PrivateRoute requireAdmin={true}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      
      {/* Rotas Privadas - Clientes */}
      <Route path="/clientes" element={
        <PrivateRoute>
          <ClientesList />
        </PrivateRoute>
      } />
      <Route path="/clientes/novo" element={
        <PrivateRoute>
          <ClienteForm />
        </PrivateRoute>
      } />
      <Route path="/clientes/editar/:id" element={
        <PrivateRoute>
          <ClienteForm />
        </PrivateRoute>
      } />
      <Route path="/clientes/:id" element={
        <PrivateRoute>
          <ClienteForm />
        </PrivateRoute>
      } />
      
      {/* Rotas Privadas - Agendamentos */}
      <Route path="/agendamentos/novo" element={
        <PrivateRoute>
          <NovoAgendamento />
        </PrivateRoute>
      } />
      
      {/* Rotas Privadas - Profissionais */}
      <Route path="/profissionais" element={
        <PrivateRoute>
          <ProfissionaisList />
        </PrivateRoute>
      } />
      <Route path="/profissionais/novo" element={
        <PrivateRoute>
          <ProfissionalForm />
        </PrivateRoute>
      } />
      <Route path="/profissionais/editar/:id" element={
        <PrivateRoute>
          <ProfissionalForm />
        </PrivateRoute>
      } />
      
      {/* Rotas Privadas - Serviços */}
      <Route path="/servicos" element={
        <PrivateRoute>
          <ServicosList />
        </PrivateRoute>
      } />
      <Route path="/servicos/novo" element={
        <PrivateRoute>
          <ServicoForm />
        </PrivateRoute>
      } />
      <Route path="/servicos/editar/:id" element={
        <PrivateRoute>
          <ServicoForm />
        </PrivateRoute>
      } />
      
      {/* Redirecionamento padrão */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;