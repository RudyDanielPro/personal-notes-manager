import axios from 'axios';
import { logError } from '../lib/logger';
import { User } from '@/contexts/AuthContext'; // Importamos el tipo User desde AuthContext

const baseURL = "https://notes-backend-u995.onrender.com/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ===== NOTAS =====
export const fetchNotes = async () => {
  try {
    const response = await api.get("/notes");
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts');
    throw error;
  }
}

export const createNote = async (note: { titulo: string; contenido: string; etiquetas: string[] }) => {
  try {
    const response = await api.post("/notes", note);
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts createNote');
    throw error;
  }
}

export const updateNote = async (id: string, note: { titulo: string; contenido: string; etiquetas: string[] }) => {
  try {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts updateNote');
    throw error;
  }
}

export const deleteNote = async (id: string) => {
  try {
    await api.delete(`/notes/${id}`);
  } catch (error) {
    logError(error, 'Api.ts deleteNote');
    throw error;
  }
}

// ===== AUTENTICACIÓN =====
export const login = async (credentials: { identificador: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts login');
    if (axios.isAxiosError(error) && error.response) {
      let serverMessage = 'Error en el servidor';
      const data = error.response.data;
      if (data) {
        if (typeof data === 'string') {
          serverMessage = data;
        } else if (data.message) {
          serverMessage = data.message;
        } else if (data.error) {
          serverMessage = data.error;
        }
      }
      throw new Error(serverMessage);
    }
    throw error;
  }
};

export const register = async (data: { nombre: string; apellido: string; username: string; edad: number; email: string; password: string }) => {

  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const logout = () => {
  localStorage.removeItem("token");
}

export const getCurrentUser = async () => {

  try {
    const response = await api.get("/auth/me");

    return response.data;
  } catch (error) {
    logError(error, 'Api.ts getCurrentUser');
    throw error;
  }
}

// ===== ADMIN: GESTIÓN DE USUARIOS =====
export const fetchUsers = async (): Promise<User[]> => {

  try {
    const response = await api.get("/admin/users");

    return response.data;
  } catch (error) {
    logError(error, 'Api.ts fetchUsers');
    throw error;
  }
};

export const createUser = async (userData: {
  nombre: string;
  apellido: string;
  username: string;
  edad: number;
  email: string;
  password: string;
  rol?: string;
}): Promise<User> => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  id: number,
  userData: {
    nombre: string;
    apellido: string;
    username?: string;
    edad: number;
    email: string;
    password?: string;
    rol?: string;
  }
): Promise<User> => {
  try {
    const params = new URLSearchParams();
    if (userData.rol) params.append('rol', userData.rol);
    const response = await api.put(`/admin/users/${id}?${params.toString()}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<void> => {

  try {
    await api.delete(`/admin/users/${id}`);

  } catch (error) {
    logError(error, 'Api.ts deleteUser');
    throw error;
  }
};

export default api;