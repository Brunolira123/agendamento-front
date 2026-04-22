// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Função segura para parse de JSON
const safeJsonParse = (item) => {
  if (!item || item === 'undefined' || item === 'null') {
    return null;
  }
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error('Erro ao fazer parse:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosStorage = () => {
      try {
        const usuarioStorage = localStorage.getItem('usuario');
        const empresaStorage = localStorage.getItem('empresa');
        
        const usuarioData = safeJsonParse(usuarioStorage);
        const empresaData = safeJsonParse(empresaStorage);
        
        if (usuarioData) setUsuario(usuarioData);
        if (empresaData) setEmpresa(empresaData);
      } catch (error) {
        console.error('Erro ao carregar dados do storage:', error);
        localStorage.removeItem('usuario');
        localStorage.removeItem('empresa');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosStorage();
  }, []);

  // contexts/AuthContext.jsx - método login
const login = async (email, senha) => {
    try {
        // Mudar para POST com form-urlencoded
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('senha', senha);
        
        const response = await api.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
        });
        
        console.log('Resposta do login:', response.data);
        console.log('Session ID (do cookie):', document.cookie);
        
        if (response.data && response.data.id) {
            const usuarioData = {
                id: response.data.id,
                nome: response.data.nome,
                email: response.data.email,
                papel: response.data.papel
            };
            
            const empresaData = response.data.empresaId ? { id: response.data.empresaId } : null;
            
            setUsuario(usuarioData);
            if (empresaData) setEmpresa(empresaData);
            
            localStorage.setItem('usuario', JSON.stringify(usuarioData));
            if (empresaData) {
                localStorage.setItem('empresa', JSON.stringify(empresaData));
            }
            
            // Verificar sessão após login
            const sessionCheck = await api.get('/auth/session', { withCredentials: true });
            console.log('Verificação de sessão:', sessionCheck.data);
            
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
    setUsuario(null);
    setEmpresa(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('empresa');
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