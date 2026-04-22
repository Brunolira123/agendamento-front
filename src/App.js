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


function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }
  
  return usuario ? children : <Navigate to="/login" />;
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