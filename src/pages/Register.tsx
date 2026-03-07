import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { logError } from '../lib/logger';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", apellido: "", username: "", edad: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.apellido || !form.username || !form.edad || !form.email || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    const ageValue = parseInt(form.edad);
    if (isNaN(ageValue) || ageValue < 1 || ageValue > 120) {
      setError("Edad inválida.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, edad: ageValue });
      navigate("/dashboard");
    } catch (err) {
      logError(err, 'Register.tsx');
      setError("Error al crear la cuenta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-primary mb-4">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Crear cuenta</h1>
          <p className="mt-1 text-muted-foreground text-sm sm:text-base">
            Únete y empieza a tomar notas
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-md-custom">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Juan" value={form.nombre} onChange={set("nombre")} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" placeholder="Pérez" value={form.apellido} onChange={set("apellido")} className="h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input id="username" placeholder="juanperez99" value={form.username} onChange={set("username")} className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input id="age" type="number" placeholder="25" value={form.edad} onChange={set("edad")} className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@email.com" value={form.email} onChange={set("email")} className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={set("password")}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm animate-pulse">{error}</p>}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Crear cuenta
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;