// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado:', error, errorInfo);
      console.error('🔥 ERROR BOUNDARY CAPTUROU UM ERRO:', error);
  console.error('Component Stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    // Limpa o localStorage e recarrega
    localStorage.clear();
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5 text-center">
          <div className="alert alert-danger shadow-lg" style={{ borderRadius: '15px' }}>
            <h3 className="mb-3">⚠️ Ops! Algo deu errado</h3>
            <p className="mb-3">{this.state.error?.message || 'Erro ao carregar a aplicação'}</p>
            {this.state.errorInfo && (
              <details className="text-start mt-3">
                <summary>Detalhes técnicos</summary>
                <pre className="mt-2 p-2 bg-light rounded" style={{ fontSize: '12px', overflow: 'auto' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="mt-4">
              <button className="btn btn-primary me-2" onClick={this.handleReset}>
                Ir para o Login
              </button>
              <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;