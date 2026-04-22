// components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          📅 Agenda App
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes">Clientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profissionais">Profissionais</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/servicos">Serviços</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agendamentos/novo">
                <span className="badge bg-success">+ Novo Agendamento</span>
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button className="btn btn-link nav-link dropdown-toggle" data-bs-toggle="dropdown">
                👤 {usuario?.nome || 'Usuário'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={handleLogout}>Sair</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}