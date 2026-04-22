// services/api.js - Versão completa com todos os serviços
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Adiciona empresaId em todas as requisições
api.interceptors.request.use((config) => {
  try {
    const empresa = localStorage.getItem('empresa');
    if (empresa && empresa !== 'undefined' && empresa !== 'null') {
      const empresaObj = JSON.parse(empresa);
      if (config.params) {
        config.params.empresaId = empresaObj.id;
      } else {
        config.params = { empresaId: empresaObj.id };
      }
    }
  } catch (error) {
    console.error('Erro no interceptor de request:', error);
  }
  
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Trata erro 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('empresa');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== FORMATADORES ====================
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const formatCPF = (cpf) => {
  if (!cpf) return '';
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// ==================== CLIENTES ====================
export const clienteService = {
  listar: async (page = 0, size = 20, search = '') => {
    const response = await api.get('/clientes', { params: { page, size, search } });
    return response.data;
  },
  buscarPorId: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },
  buscarPorTelefone: async (telefone) => {
    const response = await api.get('/clientes/buscar', { params: { telefone } });
    return response.data;
  },
  criar: async (cliente) => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },
  atualizar: async (id, cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },
  toggleStatus: async (id) => {
    const response = await api.patch(`/clientes/${id}/toggle-status`);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  }
};

// ==================== PROFISSIONAIS ====================
export const profissionalService = {
  listar: async (apenasAtivos = true) => {
    const response = await api.get('/profissionais', { params: { ativos: apenasAtivos } });
    return response.data;
  },
  buscarPorId: async (id) => {
    const response = await api.get(`/profissionais/${id}`);
    return response.data;
  },
  criar: async (profissional) => {
    const response = await api.post('/profissionais', profissional);
    return response.data;
  },
  atualizar: async (id, profissional) => {
    const response = await api.put(`/profissionais/${id}`, profissional);
    return response.data;
  },
  toggleStatus: async (id) => {
    const response = await api.patch(`/profissionais/${id}/toggle-status`);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/profissionais/${id}`);
    return response.data;
  }
};

// ==================== SERVIÇOS ====================
export const servicoService = {
  listar: async (apenasAtivos = true) => {
    const response = await api.get('/servicos', { params: { ativos: apenasAtivos } });
    return response.data;
  },
  buscarPorId: async (id) => {
    const response = await api.get(`/servicos/${id}`);
    return response.data;
  },
  criar: async (servico) => {
    const response = await api.post('/servicos', servico);
    return response.data;
  },
  atualizar: async (id, servico) => {
    const response = await api.put(`/servicos/${id}`, servico);
    return response.data;
  },
  toggleStatus: async (id) => {
    const response = await api.patch(`/servicos/${id}/toggle-status`);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/servicos/${id}`);
    return response.data;
  }
};

// ==================== AGENDAMENTOS ====================
export const agendamentoService = {
  listar: async (params = {}) => {
    const response = await api.get('/agendamentos', { params });
    return response.data;
  },
  listarHoje: async () => {
    const response = await api.get('/agendamentos/hoje');
    return response.data;
  },
  listarPorPeriodo: async (inicio, fim) => {
    const response = await api.get('/agendamentos/periodo', { params: { inicio, fim } });
    return response.data;
  },
  buscarPorId: async (id) => {
    const response = await api.get(`/agendamentos/${id}`);
    return response.data;
  },
  criar: async (agendamento) => {
    const response = await api.post('/agendamentos', agendamento);
    return response.data;
  },
  atualizarStatus: async (id, status) => {
    const response = await api.get(`/agendamentos/${id}/status`, { params: { status } });
    return response.data;
  },
  cancelar: async (id, motivo) => {
    const response = await api.post(`/agendamentos/${id}/cancelar`, { motivo });
    return response.data;
  },
  getEstatisticas: async (data) => {
    const response = await api.get('/agendamentos/estatisticas', { params: { data } });
    return response.data;
  }
};

// Exporta a instância padrão
export default api;