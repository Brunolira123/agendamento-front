// components/clientes/ClientesList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clienteService } from '../../services/api';
import { formatPhone } from '../../utils/formatters';
import BackButton from '../BackButton';
import Navbar from '../Navbar';

function ClientesList() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clienteService.listar(page);
      setClientes(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      if (error.response?.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
        navigate('/login');
      } else {
        alert('Erro ao carregar clientes');
      }
    } finally {
      setLoading(false);
    }
  }, [page, navigate]);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const handleToggleStatus = async (id, ativo) => {
    if (window.confirm(`Deseja ${ativo ? 'desativar' : 'ativar'} este cliente?`)) {
      try {
        await clienteService.toggleStatus(id);
        carregarClientes();
      } catch (error) {
        alert('Erro ao alterar status');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clienteService.deletar(id);
        carregarClientes();
      } catch (error) {
        alert('Erro ao excluir cliente');
      }
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone?.includes(searchTerm) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <Navbar />
      <div className="container mt-4">
        <BackButton />
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Clientes</h2>
            <p className="text-muted mb-0">Total: {totalElements} clientes</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/clientes/novo')}
          >
            + Novo Cliente
          </button>
        </div>

        {/* Busca */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Buscar por nome, telefone ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setSearchTerm('')}
                >
                  Limpar Busca
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2 text-muted">Carregando clientes...</p>
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-3">Nenhum cliente encontrado</p>
                {searchTerm ? (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    Limpar busca
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/clientes/novo')}
                  >
                    + Cadastrar primeiro cliente
                  </button>
                )}
              </div>
            ) : (
              <React.Fragment>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Agendamentos</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesFiltrados.map((cliente) => (
                        <tr key={cliente.id}>
                          <td className="fw-bold">{cliente.nome}</td>
                          <td>{formatPhone(cliente.telefone)}</td>
                          <td>{cliente.email || '-'}</td>
                          <td>
                            <span className="badge bg-info">
                              {cliente.totalAgendamentos || 0}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${cliente.ativo ? 'bg-success' : 'bg-danger'}`}>
                              {cliente.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate(`/clientes/${cliente.id}`)}
                              >
                                Ver
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                              >
                                Editar
                              </button>
                              <button
                                className={`btn btn-outline-${cliente.ativo ? 'warning' : 'success'}`}
                                onClick={() => handleToggleStatus(cliente.id, cliente.ativo)}
                              >
                                {cliente.ativo ? 'Desativar' : 'Ativar'}
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(cliente.id)}
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

                {/* Paginação */}
                {totalPages > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)}>
                          « Anterior
                        </button>
                      </li>
                      <li className="page-item disabled">
                        <span className="page-link">
                          Página {page + 1} de {totalPages}
                        </span>
                      </li>
                      <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>
                          Próxima »
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ClientesList;