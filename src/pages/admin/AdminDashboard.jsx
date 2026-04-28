import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../../services/api';
import AdminPlanos from './AdminPlanos';
import AdminEmpresas from './AdminEmpresas';
import AdminFinanceiro from './AdminFinanceiro';

function AdminDashboard() {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mover useEffect para antes do early return
  useEffect(() => {
    if (usuario?.papel === 'ADMIN') {
      carregarDashboard();
    }
  }, [usuario]);

  const carregarDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verificação depois de todos os Hooks
  if (!usuario || usuario.papel !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'planos', label: '📋 Planos', icon: '📋' },
    { id: 'empresas', label: '🏢 Empresas', icon: '🏢' },
    { id: 'financeiro', label: '💰 Financeiro', icon: '💰' },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar Admin */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <div className="navbar-brand fw-bold">
            👑 Painel Admin - Agenda App
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white">Olá, {usuario?.nome}</span>
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              className="btn btn-outline-light btn-sm"
            >
              Ir para o App
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          {tabs.map(tab => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? 'active fw-bold' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Conteúdo */}
        {activeTab === 'dashboard' && (
          <AdminDashboardContent data={dashboardData} loading={loading} />
        )}
        {activeTab === 'planos' && <AdminPlanos />}
        {activeTab === 'empresas' && <AdminEmpresas />}
        {activeTab === 'financeiro' && <AdminFinanceiro />}
      </div>
    </div>
  );
}

function AdminDashboardContent({ data, loading }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const cards = [
    { title: 'Total Empresas', value: data?.totalEmpresas || 0, icon: '🏢', color: 'primary' },
    { title: 'Total Usuários', value: data?.totalUsuarios || 0, icon: '👥', color: 'info' },
    { title: 'Novas Empresas (30d)', value: data?.novasEmpresas || 0, icon: '➕', color: 'success' },
    { title: 'Assinaturas Ativas', value: data?.assinaturasAtivas || 0, icon: '✅', color: 'success' },
    { title: 'Testes Grátis', value: data?.assinaturasTeste || 0, icon: '🎁', color: 'warning' },
    { title: 'Receita Mensal', value: `R$ ${(data?.receitaMensal || 0).toFixed(2)}`, icon: '💰', color: 'danger' },
    { title: 'Receita Anual', value: `R$ ${(data?.receitaAnual || 0).toFixed(2)}`, icon: '📈', color: 'dark' },
    { title: 'Vencendo em breve', value: data?.vencendoEmBreve || 0, icon: '⏰', color: 'danger' },
  ];

  return (
    <div>
      <h3 className="mb-4">Dashboard</h3>
      
      <div className="row g-4 mb-5">
        {cards.map((card, index) => (
          <div className="col-md-3" key={index}>
            <div className={`card bg-${card.color} text-white h-100 shadow-sm`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1 opacity-75">{card.title}</h6>
                    <h2 className="mb-0">{card.value}</h2>
                  </div>
                  <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Planos mais vendidos */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">📊 Planos mais vendidos</h5>
        </div>
        <div className="card-body">
          {data?.planosVendidos && data.planosVendidos.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Plano</th>
                    <th>Quantidade</th>
                    <th>Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {data.planosVendidos.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item[0]}</td>
                      <td>{item[1]}</td>
                      <td>R$ {(item[2] || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center">Nenhum dado disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;