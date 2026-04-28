import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/empresas');
      setEmpresas(response.data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalhes = async (id) => {
    try {
      const response = await api.get(`/admin/empresas/${id}`);
      setSelectedEmpresa(response.data);
    } catch (error) {
      alert('Erro ao carregar detalhes');
    }
  };

  const filteredEmpresas = empresas.filter(e =>
    e.nome.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">🏢 Empresas</h3>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">Carregando...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Empresa</th>
                <th>Slug</th>
                <th>Nicho</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpresas.map(empresa => (
                <tr key={empresa.id}>
                  <td>{empresa.id}</td>
                  <td>{empresa.nome}</td>
                  <td><code>{empresa.slug}</code></td>
                  <td>{empresa.nicho}</td>
                  <td>{empresa.email}</td>
                  <td>{empresa.telefone}</td>
                  <td>{formatDate(empresa.createdAt)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-info" onClick={() => verDetalhes(empresa.id)}>
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedEmpresa && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedEmpresa.empresa?.nome} - Detalhes</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedEmpresa(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informações da Empresa</h6>
                    <p><strong>ID:</strong> {selectedEmpresa.empresa?.id}</p>
                    <p><strong>Slug:</strong> {selectedEmpresa.empresa?.slug}</p>
                    <p><strong>Nicho:</strong> {selectedEmpresa.empresa?.nicho}</p>
                    <p><strong>E-mail:</strong> {selectedEmpresa.empresa?.email}</p>
                    <p><strong>Telefone:</strong> {selectedEmpresa.empresa?.telefone}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Proprietário</h6>
                    <p><strong>Nome:</strong> {selectedEmpresa.dono?.nome}</p>
                    <p><strong>E-mail:</strong> {selectedEmpresa.dono?.email}</p>
                  </div>
                </div>
                
                <hr />
                
                <div className="row">
                  <div className="col-md-6">
                    <h6>Assinatura Atual</h6>
                    {selectedEmpresa.assinaturaAtual ? (
                      <>
                        <p><strong>Plano:</strong> {selectedEmpresa.assinaturaAtual.plano?.nome}</p>
                        <p><strong>Status:</strong> {selectedEmpresa.assinaturaAtual.status}</p>
                        <p><strong>Início:</strong> {formatDate(selectedEmpresa.assinaturaAtual.dataInicio)}</p>
                        <p><strong>Fim:</strong> {formatDate(selectedEmpresa.assinaturaAtual.dataFim)}</p>
                      </>
                    ) : (
                      <p>Nenhuma assinatura ativa</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6>Estatísticas</h6>
                    <p><strong>Total Agendamentos:</strong> {selectedEmpresa.totalAgendamentos || 0}</p>
                    <p><strong>Total Profissionais:</strong> {selectedEmpresa.totalProfissionais || 0}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedEmpresa(null)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEmpresas;