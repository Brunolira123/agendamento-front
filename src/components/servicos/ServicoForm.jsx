// components/servicos/ServicoForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicoService } from '../../services/api';
import Navbar from '../Navbar';

function ServicoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracaoMinutos: '30'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      carregarServico();
    }
  }, [id]);

  const carregarServico = async () => {
    setLoading(true);
    try {
      const servico = await servicoService.buscarPorId(id);
      setFormData({
        nome: servico.nome || '',
        descricao: servico.descricao || '',
        preco: servico.preco || '',
        duracaoMinutos: servico.duracaoMinutos || '30'
      });
    } catch (error) {
      console.error('Erro ao carregar serviço:', error);
      alert('Erro ao carregar dados do serviço');
    } finally {
      setLoading(false);
    }
  };

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
    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }
    if (!formData.duracaoMinutos || parseInt(formData.duracaoMinutos) <= 0) {
      newErrors.duracaoMinutos = 'Duração deve ser maior que zero';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const dados = {
        ...formData,
        preco: parseFloat(formData.preco),
        duracaoMinutos: parseInt(formData.duracaoMinutos)
      };
      
      if (isEditing) {
        await servicoService.atualizar(id, dados);
        alert('Serviço atualizado com sucesso!');
      } else {
        await servicoService.criar(dados);
        alert('Serviço criado com sucesso!');
      }
      navigate('/servicos');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      const errorMsg = error.response?.data?.error || 'Erro ao salvar serviço';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <h4>{isEditing ? 'Editar Serviço' : 'Novo Serviço'}</h4>
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
                  <label className="form-label">Preço *</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
                    name="preco"
                    placeholder="49.90"
                    value={formData.preco}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.preco && <div className="invalid-feedback">{errors.preco}</div>}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Duração (minutos) *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.duracaoMinutos ? 'is-invalid' : ''}`}
                    name="duracaoMinutos"
                    placeholder="30"
                    value={formData.duracaoMinutos}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.duracaoMinutos && <div className="invalid-feedback">{errors.duracaoMinutos}</div>}
                </div>
                
                <div className="col-12 mb-3">
                  <label className="form-label">Descrição</label>
                  <textarea
                    className="form-control"
                    name="descricao"
                    rows="3"
                    placeholder="Descrição do serviço..."
                    value={formData.descricao}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/servicos')}
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

export default ServicoForm;