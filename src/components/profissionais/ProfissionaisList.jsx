// components/profissionais/ProfissionaisList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { profissionalService } from '../../services/api';
import { formatPhone } from '../../services/api';
import BackButton from '../BackButton';
import Navbar from '../Navbar';

function ProfissionaisList() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivos, setFiltroAtivos] = useState(true);

  const carregarProfissionais = useCallback(async () => {
    setLoading(true);
    try {
      const data = await profissionalService.listar(filtroAtivos);
      setProfissionais(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      alert('Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  }, [filtroAtivos]);

  useEffect(() => {
    carregarProfissionais();
  }, [carregarProfissionais]);

  const handleToggleStatus = async (id, ativo) => {
    if (window.confirm(`Deseja ${ativo ? 'desativar' : 'ativar'} este profissional?`)) {
      try {
        await profissionalService.toggleStatus(id);
        carregarProfissionais();
      } catch (error) {
        alert('Erro ao alterar status');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await profissionalService.deletar(id);
        carregarProfissionais();
      } catch (error) {
        alert('Erro ao excluir profissional');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <BackButton />
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Profissionais</h2>
          <div>
            <button 
              className="btn btn-outline-secondary me-2"
              onClick={() => setFiltroAtivos(!filtroAtivos)}
            >
              {filtroAtivos ? 'Mostrar Inativos' : 'Mostrar Ativos'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/profissionais/novo')}
            >
              + Novo Profissional
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : profissionais.length === 0 ? (
              <div className="text-center py-4 text-muted">
                Nenhum profissional cadastrado
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profissionais.map((profissional) => (
                      <tr key={profissional.id}>
                        <td className="fw-bold">{profissional.nome}</td>
                        <td>{profissional.email || '-'}</td>
                        <td>{formatPhone(profissional.telefone)}</td>
                        <td>
                          <span className={`badge ${profissional.ativo ? 'bg-success' : 'bg-danger'}`}>
                            {profissional.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => navigate(`/profissionais/editar/${profissional.id}`)}
                            >
                              Editar
                            </button>
                            <button
                              className={`btn btn-outline-${profissional.ativo ? 'warning' : 'success'}`}
                              onClick={() => handleToggleStatus(profissional.id, profissional.ativo)}
                            >
                              {profissional.ativo ? 'Desativar' : 'Ativar'}
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(profissional.id)}
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

export default ProfissionaisList;