import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, LayoutDashboard, Plus, User, LogOut, Users } from "lucide-react"; // Agregamos Users
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-secondary/80 backdrop-blur-md text-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-2 sm:px-6">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-primary group-hover:scale-105 transition-transform">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Notitas</span>
          </Link>

          {/* Nav + actions */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2 hidden xs:inline-flex"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {/* Botón de admin solo visible para usuarios con rol ADMIN */}
            {user?.rol === 'ADMIN' && (
              <Link to="/admin/users">
                <Button
                  variant={location.pathname.startsWith('/admin') ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Usuarios
                </Button>
              </Link>
            )}

            <Link to="/notes/new">
              <Button size="sm" className="gap-2 shadow-primary">
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Nueva nota</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {user?.nombre ? user.nombre[0].toUpperCase() : "?"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user?.nombre} {user?.apellido}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Mi perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
};