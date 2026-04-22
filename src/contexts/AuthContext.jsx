// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosStorage = () => {
      try {
        const token = localStorage.getItem('token');
        const usuarioStorage = localStorage.getItem('usuario');
        
        if (token && usuarioStorage && usuarioStorage !== 'undefined') {
          const usuarioData = JSON.parse(usuarioStorage);
          setUsuario(usuarioData);
          
          if (usuarioData.empresaId) {
            setEmpresa({ id: usuarioData.empresaId });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    carregarDadosStorage();
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      
      if (response.token) {
        const usuarioData = {
          id: response.id,
          nome: response.nome,
          email: response.email,
          papel: response.papel,
          empresaId: response.empresaId
        };
        
        setUsuario(usuarioData);
        if (response.empresaId) {
          setEmpresa({ id: response.empresaId });
        }
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        
        return { success: true };
      }
      
      return { success: false, error: 'Resposta inválida do servidor' };
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.response?.status === 401) {
        return { success: false, error: 'E-mail ou senha inválidos' };
      }
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
    setEmpresa(null);
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      empresa, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!usuario 
    }}>
      {children}
    </AuthContext.Provider>
  );
};