import { Link } from "react-router-dom";
import { Note } from "@/contexts/NotesContext";
import { Edit3, Trash2 } from "lucide-react";
import { useNotes } from "@/contexts/NotesContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface Props {
  note: Note;
  index?: number;
  onTagClick?: (tag: string) => void;
  showActions?: boolean;
}

export const NoteCard = ({ note, index = 0, onTagClick, showActions = true }: Props) => {
  const { deleteNote } = useNotes();
  const navigate = useNavigate();

  return (
    <div
      className="group relative rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md-custom transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, opacity: 0, animationFillMode: "forwards" }}
    >
      {/* Actions */}
      {showActions && (
        <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/notes/${note.id}/edit`}>
            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar nota?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La nota "{note.title}" se eliminará permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteNote(note.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Content */}
      <Link to={`/notes/${note.id}`} className="block">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 pr-12">{note.title}</h3>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">{note.content}</p>
      </Link>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground hover:bg-primary/20 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Date */}
      <p className="mt-3 text-xs text-muted-foreground/70">
        {new Date(note.updatedAt).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
};
