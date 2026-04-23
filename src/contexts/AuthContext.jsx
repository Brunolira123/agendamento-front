// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já está logado ao carregar a página
    const token = localStorage.getItem('token');
    const usuarioStorage = localStorage.getItem('usuario');
    
    console.log('🔍 AuthProvider - token:', !!token);
    console.log('🔍 AuthProvider - usuarioStorage:', !!usuarioStorage);
    
    if (token && usuarioStorage) {
      try {
        const usuarioData = JSON.parse(usuarioStorage);
        setUsuario(usuarioData);
        if (usuarioData.empresaId) {
          setEmpresa({ id: usuarioData.empresaId });
        }
        console.log('✅ Usuário restaurado:', usuarioData.email);
      } catch (error) {
        console.error('Erro ao restaurar usuário:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      console.log('🔐 Login iniciado');
      
      // Chamada direta à API
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('senha', senha);
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      console.log('📦 Resposta:', response.data);
      
      if (response.data.token) {
           console.log('✅ Login OK! Token salvo no localStorage');
        const usuarioData = {
          id: response.data.id,
          nome: response.data.nome,
          email: response.data.email,
          papel: response.data.papel,
          empresaId: response.data.empresaId || 1
        };
        
        // Salvar no localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(usuarioData));

        const savedToken = localStorage.getItem('token');
      console.log('Verificação pós-salvamento - token:', !!savedToken);
        
        // Atualizar estado
        setUsuario(usuarioData);
        setEmpresa({ id: usuarioData.empresaId });
        
        console.log('✅ Login OK! Token salvo.');
        return { success: true };
      }
      
      return { success: false, error: 'Erro no login' };
    } catch (error) {
      console.error('❌ Erro:', error);
      return { success: false, error: 'Credenciais inválidas' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setEmpresa(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ usuario, empresa, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};