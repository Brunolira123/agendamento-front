// pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    
    const result = await login(email, senha);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErro(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem' }}>📅</div>
          <h2 className="mb-2 mt-2">Agenda App</h2>
          <p className="text-muted">Sistema de Agendamento</p>
        </div>
        
        {erro && (
          <div className="alert alert-danger" role="alert">
            {erro}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="admin@barbearia.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="123456"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold" 
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <small className="text-muted">
            Demo: admin@barbearia.com / 123456
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;