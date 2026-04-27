import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({
    nomeEmpresa: '',
    slug: '',
    nicho: 'barbearia',
    email: '',
    telefone: '',
    nomeDono: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    if (e.target.name === 'nomeEmpresa') {
      const slug = e.target.value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }
    
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/cadastro', {
        nomeEmpresa: form.nomeEmpresa,
        slug: form.slug,
        nicho: form.nicho,
        email: form.email,
        telefone: form.telefone,
        nomeDono: form.nomeDono,
        senha: form.senha
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('empresa', JSON.stringify(response.data.empresa));
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const nichos = [
    { value: 'barbearia', label: '✂️ Barbearia' },
    { value: 'salao', label: '💇 Salão de Beleza' },
    { value: 'lava_rapido', label: '🚗 Lava Rápido' },
    { value: 'clinica', label: '🏥 Clínica/Consultório' },
    { value: 'academia', label: '💪 Academia/Personal' },
  ];

  return (
    <div className="min-vh-100 py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '3rem' }}>📅</div>
                  <h2 className="mb-2">Crie sua conta</h2>
                  <p className="text-muted">Comece a gerenciar sua agenda em minutos</p>
                </div>

                {erro && <div className="alert alert-danger">{erro}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Tipo de negócio *</label>
                    <select name="nicho" className="form-select" value={form.nicho} onChange={handleChange} required>
                      {nichos.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nome da empresa *</label>
                    <input type="text" name="nomeEmpresa" className="form-control" 
                      value={form.nomeEmpresa} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL da sua agenda *</label>
                    <div className="input-group">
                      <span className="input-group-text">agenda.app/</span>
                      <input type="text" name="slug" className="form-control" 
                        value={form.slug} onChange={handleChange} required />
                    </div>
                    <small className="text-muted">Seus clientes vão acessar por essa URL</small>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">E-mail *</label>
                      <input type="email" name="email" className="form-control" 
                        value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Telefone *</label>
                      <input type="tel" name="telefone" className="form-control" 
                        value={form.telefone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nome do proprietário *</label>
                    <input type="text" name="nomeDono" className="form-control" 
                      value={form.nomeDono} onChange={handleChange} required />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Senha *</label>
                      <input type="password" name="senha" className="form-control" 
                        value={form.senha} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Confirmar senha *</label>
                      <input type="password" name="confirmarSenha" className="form-control" 
                        value={form.confirmarSenha} onChange={handleChange} required />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" 
                    disabled={loading}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                    {loading ? 'Cadastrando...' : 'Cadastrar e começar'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">Já tem conta?</span>{' '}
                  <Link to="/login" className="text-decoration-none">Fazer login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;