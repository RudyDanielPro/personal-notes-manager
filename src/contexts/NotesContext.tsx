import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  createNote: (data: { title: string; content: string; tags: string[] }) => void;
  updateNote: (id: string, data: { title: string; content: string; tags: string[] }) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | null>(null);
const NOTES_KEY = "notes_app_notes";

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!user) { setNotes([]); return; }
    const raw = localStorage.getItem(NOTES_KEY);
    const all: Note[] = raw ? JSON.parse(raw) : [];
    const userNotes = all
      .filter((n) => n.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotes(userNotes);
  }, [user]);

  const saveAll = (updated: Note[]) => {
    const raw = localStorage.getItem(NOTES_KEY);
    const all: Note[] = raw ? JSON.parse(raw) : [];
    const othersNotes = all.filter((n) => n.userId !== user?.id);
    localStorage.setItem(NOTES_KEY, JSON.stringify([...othersNotes, ...updated]));
    const sorted = [...updated].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotes(sorted);
  };

  const createNote = (data: { title: string; content: string; tags: string[] }) => {
    if (!user) return;
    const note: Note = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: data.title,
      content: data.content,
      tags: data.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAll([note, ...notes]);
  };

  const updateNote = (id: string, data: { title: string; content: string; tags: string[] }) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n
    );
    saveAll(updated);
  };

  const deleteNote = (id: string) => {
    saveAll(notes.filter((n) => n.id !== id));
  };

  const getNoteById = (id: string) => notes.find((n) => n.id === id);

  return (
    <NotesContext.Provider value={{ notes, createNote, updateNote, deleteNote, getNoteById }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside NotesProvider");
  return ctx;
};
