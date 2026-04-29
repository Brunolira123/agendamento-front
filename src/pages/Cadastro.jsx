import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mensal');
  const [cpfStatus, setCpfStatus] = useState({ valid: null, message: '' });
  const [emailStatus, setEmailStatus] = useState({ valid: null, message: '' });
  
  const [form, setForm] = useState({
    nomeEmpresa: '',
    slug: '',
    nicho: 'barbearia',
    email: '',
    cpf: '',
    telefone: '',
    nomeDono: '',
    senha: '',
    confirmarSenha: ''
  });

  // Função para formatar CPF
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        .replace(/-$/, '');
    }
    return value;
  };

  // Função para formatar telefone
  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      if (numbers.length === 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
    }
    return value;
  };

  // Função para validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para validar CPF
  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    // Validar primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto === 10 || resto === 11 ? 0 : resto;
    if (digito1 !== parseInt(cpfLimpo.charAt(9))) return false;
    
    // Validar segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto === 10 || resto === 11 ? 0 : resto;
    if (digito2 !== parseInt(cpfLimpo.charAt(10))) return false;
    
    return true;
  };

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
    const { name, value } = e.target;
    
    // Formatação específica por campo
    if (name === 'cpf') {
      const cpfFormatado = formatCPF(value);
      setForm({ ...form, cpf: cpfFormatado });
      
      // Validação em tempo real do CPF
      const cpfLimpo = value.replace(/\D/g, '');
      if (cpfLimpo.length === 11) {
        if (!validarCPF(cpfFormatado)) {
          setCpfStatus({ valid: false, message: '❌ CPF inválido' });
        } else {
          setCpfStatus({ valid: true, message: '✅ CPF válido' });
          setTimeout(() => setCpfStatus({ valid: null, message: '' }), 3000);
        }
      } else if (cpfLimpo.length > 0 && cpfLimpo.length < 11) {
        setCpfStatus({ valid: false, message: `⚠️ Faltam ${11 - cpfLimpo.length} dígitos` });
      } else {
        setCpfStatus({ valid: null, message: '' });
      }
    } 
    else if (name === 'telefone') {
      setForm({ ...form, [name]: formatTelefone(value) });
    }
    else if (name === 'email') {
      setForm({ ...form, [name]: value });
      
      // Validação em tempo real do email
      if (value.length > 0) {
        if (!validarEmail(value)) {
          setEmailStatus({ valid: false, message: '❌ E-mail inválido' });
        } else {
          setEmailStatus({ valid: true, message: '✅ E-mail válido' });
          setTimeout(() => setEmailStatus({ valid: null, message: '' }), 3000);
        }
      } else {
        setEmailStatus({ valid: null, message: '' });
      }
    }
    else {
      setForm({ ...form, [name]: value });
    }
    
    // Auto-gera slug baseado no nome da empresa
    if (name === 'nomeEmpresa') {
      const slug = value
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
    
    // Validações
    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }
    
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (!validarEmail(form.email)) {
      setErro('Digite um e-mail válido');
      return;
    }
    
    if (form.cpf && !validarCPF(form.cpf)) {
      setErro('Digite um CPF válido');
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
        cpf: form.cpf.replace(/\D/g, ''), // Enviar apenas números
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
                      <div className="input-group">
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${emailStatus.valid === false ? 'is-invalid' : emailStatus.valid === true ? 'is-valid' : ''}`}
                          placeholder="contato@barbearia.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                        {emailStatus.valid === true && (
                          <span className="input-group-text bg-success text-white">✅</span>
                        )}
                        {emailStatus.valid === false && (
                          <span className="input-group-text bg-danger text-white">❌</span>
                        )}
                      </div>
                      {emailStatus.message && (
                        <div className={`small mt-1 ${emailStatus.valid ? 'text-success' : 'text-danger'}`}>
                          {emailStatus.message}
                        </div>
                      )}
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
                    <label className="form-label">CPF do proprietário</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="cpf"
                        className={`form-control ${cpfStatus.valid === false ? 'is-invalid' : cpfStatus.valid === true ? 'is-valid' : ''}`}
                        placeholder="123.456.789-00"
                        value={form.cpf}
                        onChange={handleChange}
                        maxLength={14}
                      />
                      {cpfStatus.valid === true && (
                        <span className="input-group-text bg-success text-white">✅</span>
                      )}
                      {cpfStatus.valid === false && (
                        <span className="input-group-text bg-danger text-white">❌</span>
                      )}
                    </div>
                    {cpfStatus.message && (
                      <div className={`small mt-1 ${cpfStatus.valid ? 'text-success' : 'text-danger'}`}>
                        {cpfStatus.message}
                      </div>
                    )}
                    <small className="text-muted">
                      Opcional, mas necessário para emissão de nota fiscal
                    </small>
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