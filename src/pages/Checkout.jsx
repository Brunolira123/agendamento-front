import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Adicionar Link
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { formatCurrency } from '../services/api';

function Checkout() {
  const { usuario, empresa } = useAuth(); // Mantém mas não usa (pode remover se quiser)
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [assinatura, setAssinatura] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState('cartao');
  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
    parcelas: 1
  });
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState(false);
  const [diasRestantes, setDiasRestantes] = useState(0);

  // Carregar dados da assinatura - usar useCallback
  const carregarAssinatura = useCallback(async () => {
    try {
      // Buscar assinatura atual
      const response = await api.get('/assinaturas/atual');
      const data = response.data;
      setAssinatura(data);
      
      // Calcular dias restantes do teste
      if (data.status === 'TESTE' && data.dataFim) {
        const fim = new Date(data.dataFim);
        const hoje = new Date();
        const diff = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
        setDiasRestantes(diff > 0 ? diff : 0);
      }
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
      // Se não tem assinatura, redirecionar
      navigate('/planos');
    }
  }, [navigate]);

  useEffect(() => {
    carregarAssinatura();
  }, [carregarAssinatura]);

  const handleCartaoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'numero') {
      // Formata cartão: 1234 5678 9012 3456
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setDadosCartao({ ...dadosCartao, [name]: formatted });
    } 
    else if (name === 'validade') {
      // Formata validade: MM/AA
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{2})/, '$1/$2')
        .substring(0, 5);
      setDadosCartao({ ...dadosCartao, [name]: formatted });
    }
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setDadosCartao({ ...dadosCartao, [name]: formatted });
    }
    else {
      setDadosCartao({ ...dadosCartao, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // Enviar para o backend processar pagamento
      const payload = {
        assinaturaId: assinatura?.id,
        metodoPagamento: metodoPagamento,
        dadosCartao: metodoPagamento === 'cartao' ? dadosCartao : null
      };

      const response = await api.post('/pagamentos/processar', payload);
      
      if (response.data.paymentUrl) {
        // Redirecionar para gateway de pagamento (boleto/PIX)
        window.location.href = response.data.paymentUrl;
      } else if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleBoletoClick = async () => {
    setLoading(true);
    try {
      const response = await api.post('/pagamentos/gerar-boleto', {
        assinaturaId: assinatura?.id
      });
      
      if (response.data.boletoUrl) {
        window.open(response.data.boletoUrl, '_blank');
      }
    } catch (error) {
      setErro('Erro ao gerar boleto');
    } finally {
      setLoading(false);
    }
  };

  const handlePixClick = async () => {
    setLoading(true);
    try {
      const response = await api.post('/pagamentos/gerar-pix', {
        assinaturaId: assinatura?.id
      });
      
      if (response.data.qrCode) {
        // Mostrar modal com QR Code PIX
        alert(`PIX gerado! Copie o código: ${response.data.qrCode}`);
      }
    } catch (error) {
      setErro('Erro ao gerar PIX');
    } finally {
      setLoading(false);
    }
  };

  if (!assinatura) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-lg mx-auto" style={{ maxWidth: '500px' }}>
          <div className="card-body p-5">
            <div className="display-1 text-success mb-3">✅</div>
            <h2 className="mb-3">Pagamento Confirmado!</h2>
            <p className="text-muted mb-4">
              Seu pagamento foi processado com sucesso. 
              Sua assinatura está ativa!
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Ir para o Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div style={{ fontSize: '3rem' }}>💳</div>
                  <h2 className="mb-2">Finalizar Assinatura</h2>
                  <p className="text-muted">Complete o pagamento para ativar seu plano</p>
                </div>

                {/* Resumo do plano */}
                <div className="bg-light rounded p-3 mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Plano:</span>
                    <strong className="text-primary">{assinatura?.plano?.nome || 'Profissional'}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Período:</span>
                    <strong>{assinatura?.periodo === 'anual' ? 'Anual' : 'Mensal'}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Valor:</span>
                    <strong className="fs-5">{formatCurrency(assinatura?.valor)}</strong>
                  </div>
                  {assinatura?.status === 'TESTE' && diasRestantes > 0 && (
                    <div className="alert alert-info mt-3 mb-0 py-2">
                      ⏰ Teste grátis: {diasRestantes} dias restantes
                      <br />
                      <small>Você pode continuar testando ou já assinar agora</small>
                    </div>
                  )}
                </div>

                {erro && (
                  <div className="alert alert-danger" role="alert">
                    {erro}
                  </div>
                )}

                {/* Forma de pagamento */}
                <h6 className="fw-bold mb-3">Forma de pagamento</h6>
                
                <div className="mb-4">
                  <div className="d-flex gap-3 flex-wrap">
                    <button
                      type="button"
                      className={`btn ${metodoPagamento === 'cartao' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setMetodoPagamento('cartao')}
                    >
                      💳 Cartão de Crédito
                    </button>
                    <button
                      type="button"
                      className={`btn ${metodoPagamento === 'boleto' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setMetodoPagamento('boleto')}
                    >
                      📄 Boleto
                    </button>
                    <button
                      type="button"
                      className={`btn ${metodoPagamento === 'pix' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setMetodoPagamento('pix')}
                    >
                      📱 PIX
                    </button>
                  </div>
                </div>

                {/* Formulário Cartão */}
                {metodoPagamento === 'cartao' && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Número do Cartão</label>
                      <input
                        type="text"
                        name="numero"
                        className="form-control"
                        placeholder="1234 5678 9012 3456"
                        value={dadosCartao.numero}
                        onChange={handleCartaoChange}
                        maxLength={19}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Nome impresso no cartão</label>
                      <input
                        type="text"
                        name="nome"
                        className="form-control"
                        placeholder="JOÃO SILVA"
                        value={dadosCartao.nome}
                        onChange={handleCartaoChange}
                        required
                      />
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Validade</label>
                        <input
                          type="text"
                          name="validade"
                          className="form-control"
                          placeholder="MM/AA"
                          value={dadosCartao.validade}
                          onChange={handleCartaoChange}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          className="form-control"
                          placeholder="123"
                          value={dadosCartao.cvv}
                          onChange={handleCartaoChange}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Parcelas</label>
                      <select
                        name="parcelas"
                        className="form-select"
                        value={dadosCartao.parcelas}
                        onChange={handleCartaoChange}
                      >
                        <option value="1">1x de {formatCurrency(assinatura?.valor)}</option>
                        <option value="2">2x de {formatCurrency(assinatura?.valor / 2)}</option>
                        <option value="3">3x de {formatCurrency(assinatura?.valor / 3)}</option>
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 fw-bold"
                      disabled={loading}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      {loading ? 'Processando...' : `Pagar ${formatCurrency(assinatura?.valor)}`}
                    </button>
                  </form>
                )}

                {/* Boleto */}
                {metodoPagamento === 'boleto' && (
                  <div className="text-center">
                    <p className="mb-3">Ao gerar o boleto, você terá 3 dias para pagar.</p>
                    <button
                      onClick={handleBoletoClick}
                      className="btn btn-primary w-100 py-2 fw-bold"
                      disabled={loading}
                    >
                      {loading ? 'Gerando...' : 'Gerar Boleto'}
                    </button>
                  </div>
                )}

                {/* PIX */}
                {metodoPagamento === 'pix' && (
                  <div className="text-center">
                    <p className="mb-3">Pague instantaneamente via PIX.</p>
                    <button
                      onClick={handlePixClick}
                      className="btn btn-primary w-100 py-2 fw-bold"
                      disabled={loading}
                    >
                      {loading ? 'Gerando...' : 'Gerar QR Code PIX'}
                    </button>
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link to="/dashboard" className="text-decoration-none small">
                    ← Voltar ao dashboard
                  </Link>
                </div>

                <hr className="my-4" />
                
                <div className="text-center">
                  <small className="text-muted">
                    🔒 Pagamento 100% seguro • Dados criptografados
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

export default Checkout;