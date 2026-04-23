// components/profissionais/ProfissionalForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { profissionalService } from '../../services/api';
import Navbar from '../Navbar';
import BackButton from '../BackButton';

function ProfissionalForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const carregarProfissional = useCallback(async () => {
    setLoading(true);
    try {
      const profissional = await profissionalService.buscarPorId(id);
      setFormData({
        nome: profissional.nome || '',
        email: profissional.email || '',
        telefone: profissional.telefone || ''
      });
    } catch (error) {
      console.error('Erro ao carregar profissional:', error);
      alert('Erro ao carregar dados do profissional');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      carregarProfissional();
    }
  }, [isEditing, carregarProfissional]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isEditing) {
        await profissionalService.atualizar(id, formData);
        alert('Profissional atualizado com sucesso!');
      } else {
        await profissionalService.criar(formData);
        alert('Profissional criado com sucesso!');
      }
      navigate('/profissionais');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      const errorMsg = error.response?.data?.error || 'Erro ao salvar profissional';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <BackButton />
        <div className="card">
          <div className="card-header">
            <h4>{isEditing ? 'Editar Profissional' : 'Novo Profissional'}</h4>
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
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    placeholder="profissional@exemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Telefone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/profissionais')}
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
    </>
  );
}

export default ProfissionalForm;