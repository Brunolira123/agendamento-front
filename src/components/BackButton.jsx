// components/BackButton.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BackButton({ defaultPath = '/dashboard' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Se estiver no dashboard, não faz nada
    if (location.pathname === '/dashboard') {
      return;
    }
    
    // Tenta voltar para página anterior
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(defaultPath);
    }
  };

  return (
    <button 
      className="btn btn-outline-secondary mb-3"
      onClick={handleBack}
    >
      ← Voltar
    </button>
  );
}