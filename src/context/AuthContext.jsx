import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('dc_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dc_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dc_user_session');
    }
  }, [currentUser]);

  const login = (email, password) => {
    // Demo admin credentials check
    const cleanEmail = email.trim().toLowerCase();
    
    // Accept demo admin credentials or any valid email format with password length >= 6
    if (cleanEmail === 'admin@dolcecandele.pt' && password === 'dolce2026') {
      const userObj = {
        email: 'admin@dolcecandele.pt',
        name: 'Administrador Dolce Candele',
        role: 'admin',
        loggedInAt: new Date().toISOString()
      };
      setCurrentUser(userObj);
      setIsLoginModalOpen(false);
      return { success: true };
    }

    if (cleanEmail && password && password.length >= 6) {
      const userObj = {
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'admin',
        loggedInAt: new Date().toISOString()
      };
      setCurrentUser(userObj);
      setIsLoginModalOpen(false);
      return { success: true };
    }

    return { success: false, error: 'Credenciais inválidas. Tente admin@dolcecandele.pt / dolce2026' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
