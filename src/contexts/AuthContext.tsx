import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  lastName: string;
  age: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "notes_app_users";
const SESSION_KEY = "notes_app_session";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      setUser(JSON.parse(session));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<User & { password: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Email o contraseña incorrectos");
    const { password: _, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
  };

  const register = async (data: RegisterData) => {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<User & { password: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    const exists = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) throw new Error("El email ya está registrado");
    const newUser = {
      id: crypto.randomUUID(),
      name: data.name,
      lastName: data.lastName,
      age: data.age,
      email: data.email,
      password: data.password,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
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
