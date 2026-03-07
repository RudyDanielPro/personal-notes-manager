import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteCard } from "@/components/NoteCard";
import { Search, Plus, StickyNote, Clock } from "lucide-react";
import { logError } from '../lib/logger';

const Dashboard = () => {
  const { notes } = useNotes();
  const { user } = useAuth();

  // --- Lógica de Estado y Filtrado ---
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => 
    Array.from(new Set(notes.flatMap(n => n.etiquetas || []))), 
    [notes]
  );

  const filtered = useMemo(() => {
    let result = notes;
    if (search) {
      result = result.filter(n => n.titulo.toLowerCase().includes(search.toLowerCase()));
    }
    if (activeTag) {
      result = result.filter(n => n.etiquetas?.includes(activeTag));
    }
    return result;
  }, [notes, search, activeTag]);

  const recentNotes = useMemo(() => notes.slice(0, 5), [notes]);

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Hola, {user?.nombre} 👋
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-0.5">
              {notes.length === 0
                ? "Aún no tienes notas. ¡Crea la primera!"
                : `Tienes ${notes.length} nota${notes.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link to="/notes/new">
            <Button className="gap-2 shadow-primary w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Nueva nota</span>
            </Button>
          </Link>
        </div>

        {/* Recent notes */}
        {recentNotes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Últimas notas
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-muted/40 scrollbar-track-transparent">
              {recentNotes.map((note, i) => (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="flex-shrink-0 w-52 sm:w-60 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-md-custom transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <p className="font-medium text-sm line-clamp-1">{note.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.contenido}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(note.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Search + filter */}
        <section>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 text-base"
              />
            </div>
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setActiveTag(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                  activeTag === null
                    ? "bg-primary text-primary-foreground border-primary shadow-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                Todas
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground border-primary shadow-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Notes grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <StickyNote className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium">
                {search || activeTag ? "Sin resultados" : "No hay notas aún"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search || activeTag ? "Intenta con otros términos" : "Crea tu primera nota"}
              </p>
              {(!search && !activeTag) && (
                <Link to="/notes/new" className="mt-4">
                  <Button size="sm" className="shadow-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear nota
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((note, i) => (
                <NoteCard key={note.id} note={note} index={i} onTagClick={setActiveTag} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;