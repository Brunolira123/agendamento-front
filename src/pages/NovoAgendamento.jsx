// pages/NovoAgendamento.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { clienteService, profissionalService, servicoService, agendamentoService } from '../services/api';

export default function NovoAgendamento() {
  const [step, setStep] = useState(1);
  const [cliente, setCliente] = useState(null);
  const [telefoneBusca, setTelefoneBusca] = useState('');
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [formData, setFormData] = useState({
    profissionalId: '',
    servicoId: '',
    dataHora: '',
    clienteNome: '',
    clienteTelefone: '',
    observacao: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [profs, servs] = await Promise.all([
        profissionalService.listar(true),
        servicoService.listar(true)
      ]);
      setProfissionais(profs);
      setServicos(servs);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const buscarCliente = async () => {
    if (!telefoneBusca) return;
    setLoading(true);
    try {
      const clienteEncontrado = await clienteService.buscarPorTelefone(telefoneBusca);
      if (clienteEncontrado) {
        setCliente(clienteEncontrado);
        setFormData(prev => ({
          ...prev,
          clienteNome: clienteEncontrado.nome,
          clienteTelefone: clienteEncontrado.telefone
        }));
        setStep(2);
      } else {
        alert('Cliente não encontrado. Vamos cadastrar um novo.');
        setStep(2);
      }
    } catch (error) {
      console.error('Erro:', error);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const servicoSelecionado = servicos.find(s => s.id === parseInt(formData.servicoId));
      
      const agendamento = {
        profissional: { id: parseInt(formData.profissionalId) },
        servico: { id: parseInt(formData.servicoId) },
        clienteNome: formData.clienteNome,
        clienteTelefone: formData.clienteTelefone,
        dataHora: formData.dataHora,
        duracaoMinutos: servicoSelecionado?.duracaoMinutos || 30,
        precoCobrado: servicoSelecionado?.preco,
        observacao: formData.observacao
      };
      
      await agendamentoService.criar(agendamento);
      alert('Agendamento criado com sucesso!');
      // Resetar formulário ou redirecionar
    } catch (error) {
      console.error('Erro:', error);
      alert(error.response?.data?.message || 'Erro ao criar agendamento');
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
            <h4>Novo Agendamento</h4>
          </div>
          <div className="card-body">
            {step === 1 && (
              <div className="text-center py-4">
                <h5>Buscar Cliente por Telefone</h5>
                <div className="row justify-content-center mt-3">
                  <div className="col-md-6">
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="(11) 99999-9999"
                      value={telefoneBusca}
                      onChange={(e) => setTelefoneBusca(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-primary btn-lg w-100"
                      onClick={buscarCliente}
                      disabled={loading}
                    >
                      Buscar
                    </button>
                  </div>
                </div>
                <hr className="my-4" />
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setStep(2)}
                >
                  Cadastrar Novo Cliente
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cliente *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.clienteNome}
                      onChange={(e) => setFormData({...formData, clienteNome: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Telefone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.clienteTelefone}
                      onChange={(e) => setFormData({...formData, clienteTelefone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Profissional *</label>
                    <select
                      className="form-control"
                      value={formData.profissionalId}
                      onChange={(e) => setFormData({...formData, profissionalId: e.target.value})}
                      required
                    >
                      <option value="">Selecione...</option>
                      {profissionais.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Serviço *</label>
                    <select
                      className="form-control"
                      value={formData.servicoId}
                      onChange={(e) => setFormData({...formData, servicoId: e.target.value})}
                      required
                    >
                      <option value="">Selecione...</option>
                      {servicos.map(s => (
                        <option key={s.id} value={s.id}>{s.nome} - R$ {s.preco}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data e Hora *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={formData.dataHora}
                      onChange={(e) => setFormData({...formData, dataHora: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Observação</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.observacao}
                      onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                    Voltar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Salvando...' : 'Agendar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}