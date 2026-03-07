import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from "@/lib/Api";
import { logError } from '../lib/logger';

export interface User {
  username: string;
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  rol: string
}

interface AuthContextType {
  user: User | null;
  login: (identificador: string, password: string) => Promise<void>; 
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  username: string;
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

  const login = async (identificador: string, password: string) => {
  try {
    const response = await apiLogin({ identificador, password }); 
    localStorage.setItem("token", response.token);

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (meError) {
        logError(meError, 'Error en /auth/me');
        setUser({
          id: 0,
          nombre: response.nombre,
          apellido: "",
          username: "",
          edad: 0,
          email: response.email,
          rol: response.rol
        });
      }
    } catch (error) {
      logError(error, 'AuthContext login');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiRegister(data);
      await login(data.email, data.password);
    } catch (error) {
      logError(error, 'AuthContext register');
      throw error;
    }
  };

  const logout = () => {
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