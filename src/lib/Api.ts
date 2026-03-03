import axios from 'axios';
import { logDebug, logError } from '../lib/logger';

const baseURL = "https://notes-backend-u995.onrender.com/api";  

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token enviado:", token);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});


export const fetchNotes = async () => {
  logDebug('Solicitando notas');
  try {
    const response = await api.get("/notes");
    logDebug('Notas recibidas');
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts');
    throw error;
  }
}

export const createNote = async (note: { titulo: string; contenido: string; etiquetas: string[] }) => {  
  logDebug('API: creando nota', note);
  try {
    const response = await api.post("/notes", note);
    logDebug('API: nota creada', response.data);
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts createNote');
    throw error;
  }
}

export const updateNote = async (id: string, note: { titulo: string; contenido: string; etiquetas: string[] }) => {  
  logDebug('API: actualizando nota', { id, ...note });
  try {
    const response = await api.put(`/notes/${id}`, note);
    logDebug('API: nota actualizada', response.data);
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts updateNote');
    throw error;
  }
}

export const deleteNote = async (id: string) => {
  logDebug('API: eliminando nota', id);
  try {
    await api.delete(`/notes/${id}`);
    logDebug('API: nota eliminada', id);
  } catch (error) {
    logError(error, 'Api.ts deleteNote');
    throw error;
  }
}

export const login = async (credentials: { email: string; password: string }) => {
  logDebug('API: login', credentials);
  try {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    logDebug('API: login exitoso', response.data);
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts login');
    throw error;
  }
}

export const register = async (data: { nombre: string; apellido: string; edad: number; email: string; password: string }) => {
  logDebug('API: registro', data);
  try {
    const response = await api.post("/auth/register", data);
    logDebug('API: registro exitoso', response.data);
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts register');
    throw error;
  }
}

export const logout = () => {
  localStorage.removeItem("token");
}

export const getCurrentUser = async () => {
  logDebug('API: obteniendo usuario actual');
  try {
    const response = await api.get("/auth/me");
    logDebug('API: usuario obtenido', response.data);
    return response.data;
  } catch (error) {
    logError(error, 'Api.ts getCurrentUser');
    throw error;
  }
}

export default api;