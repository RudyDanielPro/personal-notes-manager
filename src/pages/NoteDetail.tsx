import { useNavigate, useParams, Link } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, Trash2, Calendar, Tag } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getNoteById, deleteNote } = useNotes();
  const navigate = useNavigate();
  const note = getNoteById(id!);

  if (!note) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-medium">Nota no encontrada</p>
          <Link to="/dashboard" className="mt-4">
            <Button variant="outline">Volver al dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Link to={`/notes/${id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Editar
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5">
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar nota?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. La nota se eliminará permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => { deleteNote(note.id); navigate("/dashboard"); }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <article className="rounded-2xl border border-border bg-card p-6 shadow-md-custom">
          <h1 className="text-2xl font-bold leading-tight mb-4">{note.title}</h1>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-5 pb-5 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Creada: {new Date(note.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            {note.updatedAt !== note.createdAt && (
              <span className="flex items-center gap-1.5">
                <Edit3 className="h-3.5 w-3.5" />
                Editada: {new Date(note.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{note.content}</p>
          </div>

          {note.tags.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Etiquetas</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <Link key={tag} to={`/dashboard`}>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground hover:bg-primary/20 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
};

export default NoteDetail;
