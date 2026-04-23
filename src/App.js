// App.js (versão limpa)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientesList from './components/clientes/ClientesList';
import ClienteForm from './components/clientes/ClienteForm';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import NovoAgendamento from './pages/NovoAgendamento';
import ProfissionaisList from './components/profissionais/ProfissionaisList';
import ProfissionalForm from './components/profissionais/ProfissionalForm';
import ServicosList from './components/servicos/ServicosList';
import ServicoForm from './components/servicos/ServicoForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const usuarioStorage = localStorage.getItem('usuario');
  
  console.log('========== PRIVATE ROUTE ==========');
  console.log('token existe?', !!token);
  console.log('usuarioStorage existe?', !!usuarioStorage);
  console.log('token value:', token);
  console.log('usuarioStorage value:', usuarioStorage);
  
  if (token && usuarioStorage) {
    console.log('✅ PRIVATE ROUTE: Autorizado');
    return children;
  }
  
  console.log('❌ PRIVATE ROUTE: Não autorizado, redirecionando');
  return <Navigate to="/login" />;
}
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>} />
      <Route path="/clientes" element={
        <PrivateRoute>
          <ClientesList />
        </PrivateRoute>} />
      <Route path="/clientes/novo" element={
        <PrivateRoute>
          <ClienteForm />
        </PrivateRoute>} />
      <Route path="/clientes/editar/:id" element={
        <PrivateRoute>
          <ClienteForm />
        </PrivateRoute>} />
      <Route path="/clientes/:id" element={
        <PrivateRoute>
          <ClienteForm />
        </PrivateRoute>} />
      <Route path="/agendamentos/novo" element={
        <PrivateRoute>
          <NovoAgendamento />
        </PrivateRoute>} />
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
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
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