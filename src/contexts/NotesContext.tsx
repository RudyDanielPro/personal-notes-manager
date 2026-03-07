import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {  fetchNotes as apiFetchNotes,createNote as apiCreateNote,updateNote as apiUpdateNote,deleteNote as apiDeleteNote,} from "@/lib/Api";
import { logError } from '../lib/logger';

export interface Note {
  id: number;  
  titulo: string;  
  contenido: string;  
  etiquetas: string[];  
  fecha: string;  
  usuarioId: number; 
}

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  createNote: (data: { titulo: string; contenido: string; etiquetas: string[] }) => Promise<void>;
  updateNote: (id: number, data: { titulo: string; contenido: string; etiquetas: string[] }) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  getNoteById: (id: number) => Note | undefined;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);


export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshNotes = async () => {
    // logDebug eliminado
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiFetchNotes();
      setNotes(data);
      // logDebug eliminado
    } catch (error) {
      logError(error, 'NotesContext refreshNotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // logDebug eliminado
    if (user) {
      refreshNotes();
    } else {
      setNotes([]);
    }
  }, [user]);

  const createNote = async (data: { titulo: string; contenido: string; etiquetas: string[] }) => {
    // logDebug eliminado
    if (!user) return;
    try {
      const newNote = await apiCreateNote(data);
      setNotes(prev => [newNote, ...prev]);
      // logDebug eliminado
    } catch (error) {
      logError(error, 'NotesContext createNote');
      throw error;
    }
  };

  const updateNote = async (id: number, data: { titulo: string; contenido: string; etiquetas: string[] }) => {
    // logDebug eliminado
    try {
      const updatedNote = await apiUpdateNote(id.toString(), data);
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
      // logDebug eliminado
    } catch (error) {
      logError(error, 'NotesContext updateNote');
      throw error;
    }
  };

  const deleteNote = async (id: number) => {
    // logDebug eliminado
    try {
      await apiDeleteNote(id.toString());
      setNotes(prev => prev.filter(n => n.id !== id));
      // logDebug eliminado
    } catch (error) {
      logError(error, 'NotesContext deleteNote');
      throw error;
    }
  };

  const getNoteById = (id: number) => notes.find((n) => n.id === id);

  return (
    <NotesContext.Provider 
      value={{ 
        notes, 
        loading,
        createNote, 
        updateNote, 
        deleteNote, 
        getNoteById,
        refreshNotes 
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside NotesProvider");
  return ctx;
};