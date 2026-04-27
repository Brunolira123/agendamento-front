import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { agendamentoService, profissionalService } from '../services/api';
import { formatCurrency, formatTime, formatDate } from '../services/api';

function Dashboard() {
  const { usuario, empresa } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('todos');
  const [viewMode, setViewMode] = useState('agenda');
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    confirmados: 0,
    concluidos: 0,
    cancelados: 0,
    faturamento: 0
  });

  // Horário comercial (8h às 20h)
  const horarios = Array.from({ length: 13 }, (_, i) => i + 8);

  // Carregar dados
  const carregarDados = useCallback(async () => {
    let empresaId = empresa?.id;
    
    // Tenta recuperar do localStorage se não tiver no estado
    if (!empresaId) {
      const empresaStorage = localStorage.getItem('empresa');
      if (empresaStorage && empresaStorage !== 'undefined') {
        try {
          const empresaData = JSON.parse(empresaStorage);
          empresaId = empresaData.id;
          console.log('Empresa recuperada do localStorage:', empresaId);
        } catch (e) {
          console.error('Erro ao parse empresa:', e);
        }
      }
    }
    
    // Se ainda não tem empresaId, aguarda
    if (!empresaId) {
      console.log('Aguardando empresaId...');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const [agendamentosRes, profissionaisRes, statsRes] = await Promise.all([
        agendamentoService.listarPorPeriodo(empresaId, dataSelecionada, dataSelecionada),
        profissionalService.listar(true),
        agendamentoService.getEstatisticasPorEmpresa(empresaId, dataSelecionada)
      ]);
      
      setAgendamentos(agendamentosRes || []);
      setProfissionais(profissionaisRes || []);
      setEstatisticas(statsRes || {
        total: 0,
        confirmados: 0,
        concluidos: 0,
        cancelados: 0,
        faturamento: 0
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

  // Atualizar status do agendamento
  const atualizarStatus = async (id, status) => {
    try {
      await agendamentoService.atualizarStatus(id, status);
      carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro: ' + (error.response?.data?.message || error.message));
    }
  };

  // Buscar agendamento para um profissional e horário
  const getAgendamento = (profissionalId, hora) => {
    const horaInicio = `${dataSelecionada}T${hora.toString().padStart(2, '0')}:00:00`;
    const horaFim = `${dataSelecionada}T${(hora + 1).toString().padStart(2, '0')}:00:00`;
    
    return agendamentos.find(a => 
      a.profissional?.id === profissionalId && 
      a.dataHora >= horaInicio && 
      a.dataHora < horaFim
    );
  };

  // Cores por status
  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMADO': return 'bg-success';
      case 'CONCLUIDO': return 'bg-secondary';
      case 'CANCELADO': return 'bg-danger';
      default: return 'bg-primary';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'CONFIRMADO': return '✅';
      case 'CONCLUIDO': return '✔️';
      case 'CANCELADO': return '❌';
      default: return '📝';
    }
  };

  // Filtrar profissionais
  const profissionaisFiltrados = profissionalSelecionado === 'todos' 
    ? profissionais 
    : profissionais.filter(p => p.id === parseInt(profissionalSelecionado));

  // Próximos atendimentos (ordenados por horário)
  const proximosAtendimentos = [...agendamentos]
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
    .slice(0, 5);

  // Navegar entre datas
  const mudarData = (dias) => {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() + dias);
    setDataSelecionada(novaData.toISOString().split('T')[0]);
  };

  const hoje = new Date().toISOString().split('T')[0];

  // Se não tem empresa, mostra loading
  if (!empresa?.id && !localStorage.getItem('empresa')) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="mb-0">Dashboard</h2>
            <p className="text-muted mb-0">
            Bem-vindo, {usuario?.nome || 'Usuário'}!
            </p>
          </div>
          <div className="d-flex gap-2">
            <div className="btn-group">
              <button 
                className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('cards')}
                title="Visualização em Cards"
              >
                📊 Cards
              </button>
              <button 
                className={`btn ${viewMode === 'agenda' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('agenda')}
                title="Visualização em Agenda"
              >
                📅 Agenda
              </button>
              <button 
                className={`btn ${viewMode === 'lista' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('lista')}
                title="Visualização em Lista"
              >
                📋 Lista
              </button>
            </div>
            <button 
              className="btn btn-success"
              onClick={() => window.location.href = '/agendamentos/novo'}
            >
              + Novo Agendamento
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="row mb-4">
          <div className="col-md-3 mb-2">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Total Hoje</h6>
                    <h2 className="mb-0">{estatisticas.total}</h2>
                  </div>
                  <div style={{ fontSize: '2rem' }}>📅</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Confirmados</h6>
                    <h2 className="mb-0">{estatisticas.confirmados}</h2>
                  </div>
                  <div style={{ fontSize: '2rem' }}>✅</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Concluídos</h6>
                    <h2 className="mb-0">{estatisticas.concluidos}</h2>
                  </div>
                  <div style={{ fontSize: '2rem' }}>✔️</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Faturamento</h6>
                    <h2 className="mb-0">{formatCurrency(estatisticas.faturamento)}</h2>
                  </div>
                  <div style={{ fontSize: '2rem' }}>💰</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seletor de Data e Filtros */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-4 mb-2 mb-md-0">
                <label className="form-label fw-bold">📅 Data</label>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => mudarData(-1)}
                  >
                    ←
                  </button>
                  <input
                    type="date"
                    className="form-control text-center"
                    value={dataSelecionada}
                    onChange={(e) => setDataSelecionada(e.target.value)}
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => mudarData(1)}
                  >
                    →
                  </button>
                  {dataSelecionada !== hoje && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setDataSelecionada(hoje)}
                    >
                      Hoje
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-4 mb-2 mb-md-0">
                <label className="form-label fw-bold">👤 Profissional</label>
                <select 
                  className="form-select"
                  value={profissionalSelecionado}
                  onChange={(e) => setProfissionalSelecionado(e.target.value)}
                >
                  <option value="todos">Todos os profissionais</option>
                  {profissionais.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">📊 Resumo</label>
                <div className="text-muted">
                  {formatDate(dataSelecionada)} • {agendamentos.length} agendamento(s)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Atendimentos (apenas nas views que não são agenda) */}
        {proximosAtendimentos.length > 0 && viewMode !== 'agenda' && (
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">⏰ Próximos Atendimentos</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {proximosAtendimentos.map(a => (
                  <div className="col-md-6 col-lg-4 mb-2" key={a.id}>
                    <div className="border rounded p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">{formatTime(a.dataHora)}</span>
                        <span className={`badge ${getStatusColor(a.status)}`}>
                          {getStatusIcon(a.status)} {a.status}
                        </span>
                      </div>
                      <div className="mt-1">
                        <strong>{a.clienteNome}</strong>
                      </div>
                      <div className="text-muted small">
                        {a.profissional?.nome} • {a.servico?.nome}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-2">Carregando agenda...</p>
          </div>
        ) : viewMode === 'cards' ? (
          // ==================== VISÃO CARDS ====================
          <div className="row">
            {agendamentos.length === 0 ? (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <p className="text-muted mb-3">Nenhum agendamento para esta data</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = '/agendamentos/novo'}
                    >
                      + Criar primeiro agendamento
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              agendamentos.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora)).map(a => (
                <div className="col-md-6 col-lg-4 mb-3" key={a.id}>
                  <div className="card h-100 shadow-sm">
                    <div className={`card-header ${getStatusColor(a.status)} text-white`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">{formatTime(a.dataHora)}</span>
                        <span>{getStatusIcon(a.status)} {a.status}</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{a.clienteNome}</h5>
                      <p className="card-text text-muted small">
                        📞 {a.clienteTelefone || 'Não informado'}
                      </p>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <div>
                          <small className="text-muted">Profissional</small>
                          <div className="fw-bold">{a.profissional?.nome}</div>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">Serviço</small>
                          <div className="fw-bold">{a.servico?.nome}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="badge bg-info">
                          {formatCurrency(a.precoCobrado)}
                        </span>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="btn-group w-100">
                        {a.status !== 'CONFIRMADO' && a.status !== 'CONCLUIDO' && (
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => atualizarStatus(a.id, 'CONFIRMADO')}
                          >
                            ✅ Confirmar
                          </button>
                        )}
                        {a.status !== 'CONCLUIDO' && (
                          <button 
                            className="btn btn-sm btn-outline-success" 
                            onClick={() => atualizarStatus(a.id, 'CONCLUIDO')}
                          >
                            ✔️ Concluir
                          </button>
                        )}
                        {a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO' && (
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => atualizarStatus(a.id, 'CANCELADO')}
                          >
                            ❌ Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : viewMode === 'agenda' ? (
          // ==================== VISÃO AGENDA (Grade de Horários) ====================
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">📅 Agenda do Dia - {formatDate(dataSelecionada)}</h5>
            </div>
            <div className="card-body p-0">
              {profissionaisFiltrados.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Nenhum profissional cadastrado</p>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => window.location.href = '/profissionais'}
                  >
                    + Cadastrar profissional
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '80px' }} className="text-center">Horário</th>
                        {profissionaisFiltrados.map(profissional => (
                          <th key={profissional.id} className="text-center">{profissional.nome}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {horarios.map(hora => {
                        const horaStr = `${hora.toString().padStart(2, '0')}:00`;
                        return (
                          <tr key={hora}>
                            <td className="fw-bold text-center bg-light">{horaStr}</td>
                            {profissionaisFiltrados.map(profissional => {
                              const agendamento = getAgendamento(profissional.id, hora);
                              const hasAgendamento = !!agendamento;
                              
                              return (
                                <td 
                                  key={profissional.id} 
                                  className={hasAgendamento ? getStatusColor(agendamento.status) : ''}
                                  style={{ 
                                    cursor: 'pointer',
                                    backgroundColor: hasAgendamento ? undefined : '#f8f9fa',
                                    verticalAlign: 'middle'
                                  }}
                                  onClick={() => {
                                    if (hasAgendamento) {
                                      alert(`📋 Cliente: ${agendamento.clienteNome}\n✂️ Serviço: ${agendamento.servico?.nome}\n💰 Valor: ${formatCurrency(agendamento.precoCobrado)}\n📝 Status: ${agendamento.status}`);
                                    }
                                  }}
                                >
                                  {hasAgendamento ? (
                                    <div className="text-white">
                                      <div className="fw-bold">{agendamento.clienteNome}</div>
                                      <small>{agendamento.servico?.nome}</small>
                                      <div className="mt-1">
                                        <span className="badge bg-light text-dark">
                                          {formatCurrency(agendamento.precoCobrado)}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-muted text-center">
                                      <small>— Disponível —</small>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          // ==================== VISÃO LISTA (Tabela tradicional) ====================
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">📋 Lista de Agendamentos - {formatDate(dataSelecionada)}</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Horário</th>
                      <th>Cliente</th>
                      <th>Telefone</th>
                      <th>Profissional</th>
                      <th>Serviço</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-muted">
                          Nenhum agendamento para esta data
                        </td>
                      </tr>
                    ) : (
                      agendamentos.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora)).map(a => (
                        <tr key={a.id}>
                          <td className="fw-bold">{formatTime(a.dataHora)}</td>
                          <td>{a.clienteNome}</td>
                          <td>{a.clienteTelefone || '-'}</td>
                          <td>{a.profissional?.nome}</td>
                          <td>{a.servico?.nome}</td>
                          <td>{formatCurrency(a.precoCobrado)}</td>
                          <td>
                            <span className={`badge ${getStatusColor(a.status)}`}>
                              {getStatusIcon(a.status)} {a.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              {a.status !== 'CONFIRMADO' && a.status !== 'CONCLUIDO' && (
                                <button 
                                  className="btn btn-outline-primary" 
                                  onClick={() => atualizarStatus(a.id, 'CONFIRMADO')}
                                  title="Confirmar"
                                >
                                  ✅
                                </button>
                              )}
                              {a.status !== 'CONCLUIDO' && (
                                <button 
                                  className="btn btn-outline-success" 
                                  onClick={() => atualizarStatus(a.id, 'CONCLUIDO')}
                                  title="Concluir"
                                >
                                  ✔️
                                </button>
                              )}
                              {a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO' && (
                                <button 
                                  className="btn btn-outline-danger" 
                                  onClick={() => atualizarStatus(a.id, 'CANCELADO')}
                                  title="Cancelar"
                                >
                                  ❌
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;