// components/servicos/ServicosList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoService } from '../../services/api';
import { formatCurrency } from '../../services/api';
import BackButton from '../BackButton';
import Navbar from '../Navbar';

function ServicosList() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivos, setFiltroAtivos] = useState(true);

  const carregarServicos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await servicoService.listar(filtroAtivos);
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      alert('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  }, [filtroAtivos]);

  useEffect(() => {
    carregarServicos();
  }, [carregarServicos]);

  const handleToggleStatus = async (id, ativo) => {
    if (window.confirm(`Deseja ${ativo ? 'desativar' : 'ativar'} este serviço?`)) {
      try {
        await servicoService.toggleStatus(id);
        carregarServicos();
      } catch (error) {
        alert('Erro ao alterar status');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await servicoService.deletar(id);
        carregarServicos();
      } catch (error) {
        alert('Erro ao excluir serviço');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <BackButton />
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Serviços</h2>
          <div>
            <button 
              className="btn btn-outline-secondary me-2"
              onClick={() => setFiltroAtivos(!filtroAtivos)}
            >
              {filtroAtivos ? 'Mostrar Inativos' : 'Mostrar Ativos'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/servicos/novo')}
            >
              + Novo Serviço
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : servicos.length === 0 ? (
              <div className="text-center py-4 text-muted">
                Nenhum serviço cadastrado
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Preço</th>
                      <th>Duração</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map((servico) => (
                      <tr key={servico.id}>
                        <td className="fw-bold">{servico.nome}</td>
                        <td>{servico.descricao || '-'}</td>
                        <td>{formatCurrency(servico.preco)}</td>
                        <td>{servico.duracaoMinutos} min</td>
                        <td>
                          <span className={`badge ${servico.ativo ? 'bg-success' : 'bg-danger'}`}>
                            {servico.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => navigate(`/servicos/editar/${servico.id}`)}
                            >
                              Editar
                            </button>
                            <button
                              className={`btn btn-outline-${servico.ativo ? 'warning' : 'success'}`}
                              onClick={() => handleToggleStatus(servico.id, servico.ativo)}
                            >
                              {servico.ativo ? 'Desativar' : 'Ativar'}
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(servico.id)}
                            >
                              Excluir
                            </button>
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

export default ServicosList;