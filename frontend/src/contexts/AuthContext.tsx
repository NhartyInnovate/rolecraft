import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfessionalProfile, AuthTokens } from '../types';

interface AuthContextType {
  user: ProfessionalProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens, user: ProfessionalProfile) => void;
  logout: () => void;
  updateUser: (user: ProfessionalProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ProfessionalProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('rc_access_token');
    const storedRefresh = localStorage.getItem('rc_refresh_token');
    const storedUser = localStorage.getItem('rc_user');

    if (storedToken && storedRefresh && storedUser) {
      try {
        setAccessToken(storedToken);
        setRefreshToken(storedRefresh);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      }
    } else {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = (tokens: AuthTokens, userData: ProfessionalProfile) => {
    localStorage.setItem('rc_access_token', tokens.access_token);
    localStorage.setItem('rc_refresh_token', tokens.refresh_token);
    localStorage.setItem('rc_user', JSON.stringify(userData));

    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('rc_access_token');
    localStorage.removeItem('rc_refresh_token');
    localStorage.removeItem('rc_user');

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: ProfessionalProfile) => {
    setUser(updatedUser);
    localStorage.setItem('rc_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
