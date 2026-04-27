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

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Componente de rota privada (melhorado)
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const usuarioStorage = localStorage.getItem('usuario');
  
  // Remove logs em produção, mantém apenas para debug
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 PrivateRoute - Token:', !!token, 'Usuario:', !!usuarioStorage);
  }
  
  if (token && usuarioStorage) {
    return children;
  }
  
  return <Navigate to="/login" replace />;
}

// Componente de rota pública (já logado não precisa ver login)
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (token) {
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
      
      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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