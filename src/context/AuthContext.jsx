import React, { createContext, useState, useContext } from "react";

// Crear el contexto de autenticación
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función de login que valida las credenciales
  const login = async (email, password) => {
    try {
      const response = await window.electronAPI.login(email, password); 

      if (response.success) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false);
      }
      return response; 
    } catch (error) {
      console.error("Error al realizar login:", error);
      setIsAuthenticated(false); 
      return { success: false, message: 'Error interno del servidor.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
