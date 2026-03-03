import { useState, useEffect, KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { logDebug, logError } from '../lib/logger';

const NoteEdit = () => {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  logDebug('Renderizando NoteEdit', { id: numId });
  const { getNoteById, updateNote } = useNotes();
  const navigate = useNavigate();
  const note = getNoteById(numId);

  const [title, setTitle] = useState(note?.titulo ?? "");
  const [content, setContent] = useState(note?.contenido ?? "");
  const [tags, setTags] = useState<string[]>(note?.etiquetas ?? []);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!note) navigate("/dashboard");
  }, [note, navigate]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    logDebug('Editando nota', { id, title, content, tags });
    if (!title || !content) {
      setError('Completa título y contenido');
      return;
    }
    try {
      await updateNote(numId, { titulo: title, contenido: content, etiquetas: tags });
      logDebug('Nota editada correctamente');
      navigate('/dashboard');
    } catch (err) {
      logError(err, 'NoteEdit.tsx');
      setError('Error al editar la nota');
    }
  };

  if (!note) return null;

  return (
    <Layout>
      <div className="mx-auto max-w-2xl animate-fade-in px-2 sm:px-0">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">Editar nota</h1>
            <p className="text-sm text-muted-foreground sm:text-base">Modifica el contenido de tu nota</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-md-custom">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 text-base font-medium" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenido *</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="resize-none leading-relaxed text-base" />
            </div>
            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <div className="flex flex-col xs:flex-row gap-2">
                <Input placeholder="Escribe una etiqueta y presiona Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKey} className="h-10" />
                <Button type="button" variant="secondary" size="icon" onClick={addTag}><Plus className="h-4 w-4" /></Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      #{tag}
                      <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-destructive transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
            <div className="flex flex-col xs:flex-row gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancelar</Button>
              <Button type="submit" className="flex-1 gap-2 shadow-primary">
                <Save className="h-4 w-4" />Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NoteEdit;
