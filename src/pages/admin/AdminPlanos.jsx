import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminPlanos() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    slug: '',
    descricao: '',
    precoMensal: 0,
    precoAnual: 0,
    maxProfissionais: null,
    maxAgendamentosMes: null,
    temAppMobile: false,
    temRelatorios: false,
    temSuportePrioritario: false,
    temNotificacaoWhatsapp: false,
    temApi: false,
    ordem: 0,
    ativo: true
  });

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/planos');
      setPlanos(response.data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/admin/planos/${editando.id}`, form);
        alert('Plano atualizado com sucesso!');
      } else {
        await api.post('/admin/planos', form);
        alert('Plano criado com sucesso!');
      }
      setShowModal(false);
      setEditando(null);
      carregarPlanos();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar plano');
    }
  };

  const handleEdit = (plano) => {
    setEditando(plano);
    setForm({
      nome: plano.nome,
      slug: plano.slug,
      descricao: plano.descricao || '',
      precoMensal: plano.precoMensal,
      precoAnual: plano.precoAnual || 0,
      maxProfissionais: plano.maxProfissionais,
      maxAgendamentosMes: plano.maxAgendamentosMes,
      temAppMobile: plano.temAppMobile,
      temRelatorios: plano.temRelatorios,
      temSuportePrioritario: plano.temSuportePrioritario,
      temNotificacaoWhatsapp: plano.temNotificacaoWhatsapp,
      temApi: plano.temApi,
      ordem: plano.ordem || 0,
      ativo: plano.ativo
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este plano?')) {
      try {
        await api.delete(`/admin/planos/${id}`);
        alert('Plano excluído com sucesso!');
        carregarPlanos();
      } catch (error) {
        alert('Erro ao excluir plano');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5">Carregando...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">📋 Planos</h3>
        <button className="btn btn-primary" onClick={() => {
          setEditando(null);
          setForm({
            nome: '',
            slug: '',
            descricao: '',
            precoMensal: 0,
            precoAnual: 0,
            maxProfissionais: null,
            maxAgendamentosMes: null,
            temAppMobile: false,
            temRelatorios: false,
            temSuportePrioritario: false,
            temNotificacaoWhatsapp: false,
            temApi: false,
            ordem: 0,
            ativo: true
          });
          setShowModal(true);
        }}>
          + Novo Plano
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Slug</th>
              <th>Preço Mensal</th>
              <th>Preço Anual</th>
              <th>Profissionais</th>
              <th>Agendamentos</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {planos.map(plano => (
              <tr key={plano.id}>
                <td>{plano.id}</td>
                <td>{plano.nome}</td>
                <td><code>{plano.slug}</code></td>
                <td>R$ {plano.precoMensal}</td>
                <td>{plano.precoAnual ? `R$ ${plano.precoAnual}` : '-'}</td>
                <td>{plano.maxProfissionais || '∞'}</td>
                <td>{plano.maxAgendamentosMes || '∞'}</td>
                <td>
                  <span className={`badge ${plano.ativo ? 'bg-success' : 'bg-danger'}`}>
                    {plano.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(plano)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plano.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editando ? 'Editar Plano' : 'Novo Plano'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nome *</label>
                      <input type="text" className="form-control" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Slug *</label>
                      <input type="text" className="form-control" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea className="form-control" rows="2" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}></textarea>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preço Mensal</label>
                      <input type="number" step="0.01" className="form-control" value={form.precoMensal} onChange={e => setForm({...form, precoMensal: parseFloat(e.target.value)})} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preço Anual</label>
                      <input type="number" step="0.01" className="form-control" value={form.precoAnual} onChange={e => setForm({...form, precoAnual: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Máx. Profissionais</label>
                      <input type="number" className="form-control" value={form.maxProfissionais || ''} onChange={e => setForm({...form, maxProfissionais: e.target.value ? parseInt(e.target.value) : null})} />
                      <small className="text-muted">Deixe em branco para ilimitado</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Máx. Agendamentos/mês</label>
                      <input type="number" className="form-control" value={form.maxAgendamentosMes || ''} onChange={e => setForm({...form, maxAgendamentosMes: e.target.value ? parseInt(e.target.value) : null})} />
                      <small className="text-muted">Deixe em branco para ilimitado</small>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={form.temAppMobile} onChange={e => setForm({...form, temAppMobile: e.target.checked})} />
                        <label className="form-check-label">App Mobile</label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-2">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={form.temRelatorios} onChange={e => setForm({...form, temRelatorios: e.target.checked})} />
                        <label className="form-check-label">Relatórios</label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-2">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={form.temSuportePrioritario} onChange={e => setForm({...form, temSuportePrioritario: e.target.checked})} />
                        <label className="form-check-label">Suporte Prioritário</label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-2">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={form.temNotificacaoWhatsapp} onChange={e => setForm({...form, temNotificacaoWhatsapp: e.target.checked})} />
                        <label className="form-check-label">WhatsApp</label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-2">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={form.temApi} onChange={e => setForm({...form, temApi: e.target.checked})} />
                        <label className="form-check-label">API</label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-2">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={form.ativo} onChange={e => setForm({...form, ativo: e.target.checked})} />
                        <label className="form-check-label">Ativo</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPlanos;