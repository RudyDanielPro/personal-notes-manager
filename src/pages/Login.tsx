import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para controlar cuándo permitir que el navegador escriba
  const [emailReadOnly, setEmailReadOnly] = useState(true);
  const [passReadOnly, setPassReadOnly] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identificador || !password) { setError("Por favor completa todos los campos."); return; }
    setLoading(true);
    try {
      await login(identificador, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
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
          <h1 className="text-2xl font-bold">Bienvenido de vuelta</h1>
          <p className="mt-1 text-muted-foreground text-sm">Inicia sesión en tu cuenta</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-md-custom">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identificador">Correo electrónico o Usuario</Label>
              <Input
                id="identificador"
                type="text" 
                placeholder="tu@email.com o tu_usuario"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                className="h-11"
                readOnly={emailReadOnly}
                onFocus={() => setEmailReadOnly(false)}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  /* TRUCO: Solo lectura hasta que el usuario haga foco */
                  readOnly={passReadOnly}
                  onFocus={() => setPassReadOnly(false)}
                  autoComplete="current-password"
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

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-fade-in">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 shadow-primary" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;