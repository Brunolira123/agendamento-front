// components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes" onClick={() => setIsOpen(false)}>
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profissionais" onClick={() => setIsOpen(false)}>
                Profissionais
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/servicos" onClick={() => setIsOpen(false)}>
                Serviços
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agendamentos/novo" onClick={() => setIsOpen(false)}>
                <span className="badge bg-success">+ Novo Agendamento</span>
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button 
                className="btn btn-link nav-link dropdown-toggle" 
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 {usuario?.nome || 'Usuário'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Sair
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}