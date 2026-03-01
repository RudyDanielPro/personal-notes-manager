import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, BookOpen, LogOut } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const { notes } = useNotes();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const stats = [
    { label: "Notas totales", value: notes.length, icon: BookOpen },
    { label: "Etiquetas usadas", value: new Set(notes.flatMap((n) => n.tags)).size, icon: BookOpen },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-lg animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mi perfil</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Información de tu cuenta</p>
        </div>

        {/* Avatar card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-md-custom mb-4">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-primary text-primary-foreground text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name} {user?.lastName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-md-custom mb-4 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Datos personales</h3>
          <div className="space-y-3">
            {[
              { icon: User, label: "Nombre completo", value: `${user?.name} ${user?.lastName}` },
              { icon: Mail, label: "Correo electrónico", value: user?.email },
              { icon: Calendar, label: "Edad", value: `${user?.age} años` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5 text-center shadow-md-custom">
              <p className="text-3xl font-bold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full gap-2 border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/40 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;
