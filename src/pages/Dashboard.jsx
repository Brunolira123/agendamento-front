// pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { agendamentoService } from '../services/api';
import { formatCurrency, formatDate, formatTime } from '../services/api';

function Dashboard() {
  const { empresa } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    confirmados: 0,
    concluidos: 0,
    cancelados: 0,
    faturamento: 0,
  });

  const carregarDados = useCallback(async () => {
    if (!empresa?.id) return;
    
    setLoading(true);
    try {
      const [agendamentosRes, statsRes] = await Promise.all([
        agendamentoService.listarPorPeriodo(empresa.id, dataSelecionada, dataSelecionada),
        agendamentoService.getEstatisticasPorEmpresa(empresa.id, dataSelecionada)
      ]);
      
      setAgendamentos(agendamentosRes || []);
      setEstatisticas(statsRes || {
        total: 0,
        confirmados: 0,
        concluidos: 0,
        cancelados: 0,
        faturamento: 0,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [empresa?.id, dataSelecionada]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const atualizarStatus = async (id, status) => {
    try {
      await agendamentoService.atualizarStatus(id, status);
      carregarDados();
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Dashboard</h2>
          <button 
            className="btn btn-success"
            onClick={() => window.location.href = '/agendamentos/novo'}
          >
            + Novo Agendamento
          </button>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h6>Total Hoje</h6>
                <h3>{estatisticas.total}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h6>Confirmados</h6>
                <h3>{estatisticas.confirmados}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-info">
              <div className="card-body">
                <h6>Concluídos</h6>
                <h3>{estatisticas.concluidos}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h6>Faturamento</h6>
                <h3>{formatCurrency(estatisticas.faturamento)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filtro */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                />
              </div>
              <div className="col-md-8 d-flex align-items-end">
                <button 
                  onClick={() => setDataSelecionada(new Date().toISOString().split('T')[0])} 
                  className="btn btn-outline-secondary ms-auto"
                >
                  Hoje
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="card">
          <div className="card-header">
            <h5>Agendamentos - {formatDate(dataSelecionada)}</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : agendamentos.length === 0 ? (
              <div className="text-center py-4 text-muted">
                Nenhum agendamento para esta data
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Horário</th>
                      <th>Cliente</th>
                      <th>Profissional</th>
                      <th>Serviço</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map((a) => (
                      <tr key={a.id}>
                        <td className="fw-bold">{formatTime(a.dataHora)}</td>
                        <td>{a.clienteNome}</td>
                        <td>{a.profissional?.nome}</td>
                        <td>{a.servico?.nome}</td>
                        <td>{formatCurrency(a.precoCobrado)}</td>
                        <td><StatusBadge status={a.status} /></td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {a.status !== 'CONFIRMADO' && a.status !== 'CONCLUIDO' && (
                              <button 
                                onClick={() => atualizarStatus(a.id, 'CONFIRMADO')}
                                className="btn btn-outline-primary"
                              >
                                Confirmar
                              </button>
                            )}
                            {a.status !== 'CONCLUIDO' && (
                              <button 
                                onClick={() => atualizarStatus(a.id, 'CONCLUIDO')}
                                className="btn btn-outline-success"
                              >
                                Concluir
                              </button>
                            )}
                            {a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO' && (
                              <button 
                                onClick={() => atualizarStatus(a.id, 'CANCELADO')}
                                className="btn btn-outline-danger"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;