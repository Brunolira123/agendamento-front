import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { planoService, assinaturaService } from '../services/api';

function Planos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mensal');
  const [assinando, setAssinando] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [assinaturaAtual, setAssinaturaAtual] = useState(null);

  // Carregar planos da API
  useEffect(() => {
    carregarPlanos();
    if (usuario) {
      carregarAssinaturaAtual();
    }
  }, [usuario]);

  const carregarPlanos = async () => {
    setLoading(true);
    try {
      const data = await planoService.listar();
      setPlanos(data);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarAssinaturaAtual = async () => {
    try {
      const data = await assinaturaService.buscarAtual();
      setAssinaturaAtual(data);
    } catch (error) {
      // Não tem assinatura ativa
      console.log('Nenhuma assinatura ativa');
      setAssinaturaAtual(null);
    }
  };

  const handleAssinar = async (plano) => {
    if (!usuario) {
      // Salvar plano escolhido e redirecionar para cadastro
      localStorage.setItem('planoEscolhido', JSON.stringify({
        id: plano.id,
        slug: plano.slug,
        periodo: periodo,
        precoMensal: plano.precoMensal
      }));
      navigate('/cadastro');
      return;
    }

    // Se já tem assinatura ativa, redirecionar para checkout
    if (assinaturaAtual && assinaturaAtual.status === 'ATIVA') {
      navigate('/checkout');
      return;
    }

    setPlanoSelecionado(plano);
    setAssinando(true);

    try {
      const assinatura = await assinaturaService.criar({
        planoId: plano.id,
        periodo: periodo
      });
      
      // Redirecionar para checkout
      navigate('/checkout', { state: { assinatura } });
    } catch (error) {
      console.error('Erro ao assinar:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Erro ao processar assinatura';
      
      // Se o erro for "já existe assinatura", redirecionar para checkout
      if (errorMsg.includes('já existe') || errorMsg.includes('ativa')) {
        navigate('/checkout');
      } else {
        alert(errorMsg);
      }
    } finally {
      setAssinando(false);
    }
  };

  const getPreco = (plano) => {
    if (periodo === 'anual' && plano.precoAnual) {
      return plano.precoAnual;
    }
    return plano.precoMensal;
  };

  const getEconomia = (plano) => {
    if (periodo === 'anual' && plano.precoAnual) {
      return (plano.precoMensal * 12) - plano.precoAnual;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">
            Escolha o plano <span style={{ color: '#667eea' }}>ideal</span> para você
          </h1>
          <p className="lead text-muted">
            Teste grátis por 7 dias • Cancele quando quiser • Sem fidelidade
          </p>
          
          {/* Toggle período */}
          <div className="d-inline-flex bg-white rounded-pill p-1 shadow-sm mt-3">
            <button
              className={`btn rounded-pill px-4 ${periodo === 'mensal' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setPeriodo('mensal')}
            >
              📅 Mensal
            </button>
            <button
              className={`btn rounded-pill px-4 ${periodo === 'anual' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setPeriodo('anual')}
            >
              🎉 Anual <span className="badge bg-success ms-1">-16%</span>
            </button>
          </div>
        </div>

        {/* Cards de Planos */}
        <div className="row g-4 justify-content-center align-items-stretch">
          {planos.map((plano) => (
            <div className="col-md-6 col-lg-5" key={plano.id}>
              <div 
                className={`card h-100 border-0 shadow-lg text-center p-4 ${plano.slug === 'profissional' ? 'border-4' : ''}`}
                style={{ 
                  borderTop: plano.slug === 'profissional' ? '4px solid #667eea' : 'none',
                  transition: 'transform 0.3s ease'
                }}
              >
                {plano.slug === 'profissional' && (
                  <div className="mb-3">
                    <span className="badge bg-primary px-3 py-2">🔥 MAIS ESCOLHIDO</span>
                  </div>
                )}
                
                <h3 className="fw-bold mb-2">{plano.nome}</h3>
                
                <div className="mb-3">
                  <h2 className="display-4 fw-bold" style={{ color: '#667eea' }}>
                    R$ {getPreco(plano)}
                    <small className="fs-6 text-muted">/{periodo === 'mensal' ? 'mês' : 'ano'}</small>
                  </h2>
                  {periodo === 'anual' && plano.precoAnual && (
                    <p className="text-success small">
                      Economize R$ {getEconomia(plano)} por ano!
                    </p>
                  )}
                </div>
                
                <hr />
                
                <div className="text-start mt-3">
                  <div className="mb-2">
                    <strong>👥 Profissionais:</strong> {plano.maxProfissionais ? `${plano.maxProfissionais} profissional(is)` : 'Ilimitado'}
                  </div>
                  <div className="mb-2">
                    <strong>📅 Agendamentos/mês:</strong> {plano.maxAgendamentosMes ? plano.maxAgendamentosMes : 'Ilimitado'}
                  </div>
                  <div className="mb-2">
                    {plano.temAppMobile ? '✅ App mobile' : '❌ App mobile'}
                  </div>
                  <div className="mb-2">
                    {plano.temRelatorios ? '✅ Relatórios avançados' : '❌ Relatórios avançados'}
                  </div>
                  <div className="mb-2">
                    {plano.temNotificacaoWhatsapp ? '✅ WhatsApp integrado' : '❌ WhatsApp integrado'}
                  </div>
                  <div className="mb-2">
                    {plano.temSuportePrioritario ? '✅ Suporte prioritário' : '❌ Suporte prioritário'}
                  </div>
                </div>
                
                <hr />
                
                <button
                  onClick={() => handleAssinar(plano)}
                  disabled={assinando && planoSelecionado?.id === plano.id}
                  className={`btn ${plano.slug === 'profissional' ? 'btn-primary' : 'btn-outline-primary'} btn-lg w-100 mt-3 fw-bold`}
                  style={plano.slug === 'profissional' ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' } : {}}
                >
                  {assinando && planoSelecionado?.id === plano.id ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                  ) : !usuario ? (
                    'Começar teste grátis'
                  ) : assinaturaAtual?.plano?.id === plano.id ? (
                    'Plano atual ✓'
                  ) : (
                    'Assinar agora'
                  )}
                </button>
                
                {!usuario && (
                  <p className="text-muted small mt-3 mb-0">
                    ✅ 7 dias grátis • Sem compromisso
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Plano atual info */}
        {assinaturaAtual && (
          <div className="mt-4 text-center">
            <div className="alert alert-info">
              <strong>📌 Seu plano atual:</strong> {assinaturaAtual.plano?.nome || 'Profissional'} • 
              Status: {assinaturaAtual.status === 'TESTE' ? 'Teste grátis' : 'Ativo'} • 
              {assinaturaAtual.dataFim && (
                <> Válido até: {new Date(assinaturaAtual.dataFim).toLocaleDateString('pt-BR')}</>
              )}
              {assinaturaAtual.plano?.slug !== 'profissional' && assinaturaAtual.status !== 'TESTE' && (
                <button 
                  className="btn btn-sm btn-primary ms-3"
                  onClick={() => handleAssinar(planos.find(p => p.slug === 'profissional'))}
                >
                  Fazer upgrade →
                </button>
              )}
              {assinaturaAtual.status === 'TESTE' && (
                <button 
                  className="btn btn-sm btn-success ms-3"
                  onClick={() => navigate('/checkout')}
                >
                  Assinar agora →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Planos;