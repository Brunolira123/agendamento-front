// components/clientes/ClienteForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clienteService } from '../../services/api';

function ClienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    observacao: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      carregarCliente();
    }
  }, [id]);

  const carregarCliente = async () => {
    setLoading(true);
    try {
      const cliente = await clienteService.buscarPorId(id);
      setFormData({
        nome: cliente.nome || '',
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        cpf: cliente.cpf || '',
        dataNascimento: cliente.dataNascimento || '',
        observacao: cliente.observacao || ''
      });
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      alert('Erro ao carregar dados do cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (formData.telefone && formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isEditing) {
        await clienteService.atualizar(id, formData);
        alert('Cliente atualizado com sucesso!');
      } else {
        await clienteService.criar(formData);
        alert('Cliente criado com sucesso!');
      }
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      const errorMsg = error.response?.data?.error || 'Erro ao salvar cliente';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h4>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Telefone</label>
                <input
                  type="tel"
                  className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
                  name="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  placeholder="cliente@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">CPF</label>
                <input
                  type="text"
                  className="form-control"
                  name="cpf"
                  placeholder="111.111.111-11"
                  value={formData.cpf}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  className="form-control"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <div className="col-12 mb-3">
                <label className="form-label">Observação</label>
                <textarea
                  className="form-control"
                  name="observacao"
                  rows="3"
                  value={formData.observacao}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/clientes')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClienteForm;