import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mensal');
  
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

  // Carregar plano escolhido da página de planos
  useEffect(() => {
    const planoEscolhido = localStorage.getItem('planoEscolhido');
    if (planoEscolhido) {
      try {
        const plano = JSON.parse(planoEscolhido);
        setPlanoSelecionado(plano);
        if (plano.periodo) {
          setPeriodoSelecionado(plano.periodo);
        }
      } catch (e) {
        console.error('Erro ao carregar plano:', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    // Auto-gera slug baseado no nome da empresa
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
      // Enviar dados incluindo o plano escolhido
      const payload = {
        nomeEmpresa: form.nomeEmpresa,
        slug: form.slug,
        nicho: form.nicho,
        email: form.email,
        telefone: form.telefone,
        nomeDono: form.nomeDono,
        senha: form.senha,
        planoId: planoSelecionado?.id || 2, // Padrão: Profissional (id=2)
        periodo: periodoSelecionado
      };
      
      console.log('📝 Cadastrando com payload:', payload);
      
      const response = await api.post('/auth/cadastro', payload);
      
      // Limpar plano escolhido do localStorage
      localStorage.removeItem('planoEscolhido');
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('empresa', JSON.stringify(response.data.empresa));
        
        // Redirecionar para dashboard
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErro(error.response?.data?.error || 'Erro ao cadastrar. Tente novamente.');
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

                {/* Banner do plano selecionado */}
                {planoSelecionado && (
                  <div className="alert alert-primary text-center mb-4">
                    <strong>🎉 Você está testando o plano {planoSelecionado.nome || 'Profissional'}!</strong>
                    <br />
                    <small>7 dias grátis • Depois R$ {planoSelecionado.precoMensal || 99}/mês</small>
                  </div>
                )}

                {erro && (
                  <div className="alert alert-danger" role="alert">
                    {erro}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Tipo de negócio *</label>
                    <select
                      name="nicho"
                      className="form-select"
                      value={form.nicho}
                      onChange={handleChange}
                      required
                    >
                      {nichos.map(n => (
                        <option key={n.value} value={n.value}>{n.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nome da empresa *</label>
                    <input
                      type="text"
                      name="nomeEmpresa"
                      className="form-control"
                      placeholder="Ex: Barbearia do João"
                      value={form.nomeEmpresa}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL da sua agenda *</label>
                    <div className="input-group">
                      <span className="input-group-text">agenda.app/</span>
                      <input
                        type="text"
                        name="slug"
                        className="form-control"
                        placeholder="barbearia-joao"
                        value={form.slug}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <small className="text-muted">
                      Seus clientes vão acessar por essa URL
                    </small>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">E-mail *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="contato@barbearia.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Telefone *</label>
                      <input
                        type="tel"
                        name="telefone"
                        className="form-control"
                        placeholder="(11) 99999-9999"
                        value={form.telefone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nome do proprietário *</label>
                    <input
                      type="text"
                      name="nomeDono"
                      className="form-control"
                      placeholder="João Silva"
                      value={form.nomeDono}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Senha *</label>
                      <input
                        type="password"
                        name="senha"
                        className="form-control"
                        placeholder="Mínimo 6 caracteres"
                        value={form.senha}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Confirmar senha *</label>
                      <input
                        type="password"
                        name="confirmarSenha"
                        className="form-control"
                        placeholder="Digite novamente"
                        value={form.confirmarSenha}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold"
                    disabled={loading}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar e começar'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">Já tem conta?</span>{' '}
                  <Link to="/login" className="text-decoration-none">Fazer login</Link>
                </div>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Ao cadastrar, você concorda com os Termos de Uso e Política de Privacidade
                  </small>
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