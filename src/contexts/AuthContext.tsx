import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from "@/lib/Api";
import { logDebug, logError } from '../lib/logger';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  rol: string
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  password: string
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    logDebug('Intentando login', { email });
    try {
      const response = await apiLogin({ email, password });
      logDebug('Login response:', response);
      localStorage.setItem("token", response.token);
      
      try {
        const userData = await getCurrentUser();
        logDebug('UserData response:', userData);
        setUser(userData);
      } catch (meError) {
        logError(meError, 'Error en /auth/me');
        setUser({
          id: 0,
          nombre: response.nombre,
          apellido: "",
          edad: 0,
          email: response.email,
          rol: response.rol
        });
      }
      
      logDebug('Login exitoso');
    } catch (error) {
      logError(error, 'AuthContext login');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    logDebug('Intentando registro', data);
    try {
      const response = await apiRegister(data);
      logDebug('Registro exitoso', response);
      await login(data.email, data.password);
    } catch (error) {
      logError(error, 'AuthContext register');
      throw error;
    }
  };

  const logout = () => {
    logDebug('Logout ejecutado');
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};