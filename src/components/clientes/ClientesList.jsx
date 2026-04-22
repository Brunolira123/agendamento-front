// components/clientes/ClientesList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clienteService } from '../../services/api';
import { formatPhone, formatCPF } from '../../utils/formatters';

function ClientesList() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    carregarClientes();
  }, [page]);

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.listar(page);
      setClientes(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

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
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone?.includes(searchTerm)
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Clientes</h2>
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
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="text-center py-4 text-muted">
              Nenhum cliente cadastrado
            </div>
          ) : (
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
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>
                    Anterior
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    Página {page + 1} de {totalPages}
                  </span>
                </li>
                <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>
                    Próxima
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientesList;