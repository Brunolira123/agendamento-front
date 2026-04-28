import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminFinanceiro() {
  const [assinaturas, setAssinaturas] = useState([]);
  const [resumo, setResumo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/financeiro/assinaturas');
      setAssinaturas(response.data.assinaturas || []);
      setResumo({
        receitaMensal: response.data.receitaMensal || 0,
        assinaturasAtivas: response.data.assinaturasAtivas || 0,
        assinaturasCanceladas: response.data.assinaturasCanceladas || 0,
        total: response.data.total || 0
      });
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return <div className="text-center py-5">Carregando...</div>;
  }

  return (
    <div>
      <h3 className="mb-4">💰 Financeiro</h3>

      {/* Cards Resumo */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6>Receita Mensal</h6>
              <h3>{formatCurrency(resumo.receitaMensal)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6>Assinaturas Ativas</h6>
              <h3>{resumo.assinaturasAtivas}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h6>Assinaturas Canceladas</h6>
              <h3>{resumo.assinaturasCanceladas}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6>Total de Assinaturas</h6>
              <h3>{resumo.total}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Assinaturas */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">📋 Lista de Assinaturas</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Empresa</th>
                  <th>Plano</th>
                  <th>Status</th>
                  <th>Período</th>
                  <th>Valor</th>
                  <th>Início</th>
                  <th>Fim</th>
                </tr>
              </thead>
              <tbody>
                {assinaturas.map(assinatura => (
                  <tr key={assinatura.id}>
                    <td>{assinatura.id}</td>
                    <td>{assinatura.empresa?.nome || assinatura.empresaId}</td>
                    <td>{assinatura.plano?.nome}</td>
                    <td>
                      <span className={`badge ${assinatura.status === 'ATIVA' ? 'bg-success' : assinatura.status === 'TESTE' ? 'bg-warning' : 'bg-danger'}`}>
                        {assinatura.status}
                      </span>
                    </td>
                    <td>{assinatura.periodo}</td>
                    <td>{formatCurrency(assinatura.valor)}</td>
                    <td>{formatDate(assinatura.dataInicio)}</td>
                    <td>{formatDate(assinatura.dataFim)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFinanceiro;