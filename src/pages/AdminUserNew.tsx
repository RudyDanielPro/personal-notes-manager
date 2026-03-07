import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { createUser } from "@/lib/Api";
import { toast } from "sonner";

const AdminUserNew = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    username: "",
    edad: "",
    email: "",
    password: "",
    rol: "USER",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.username || !form.edad || !form.email || !form.password) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    const edadNum = parseInt(form.edad);
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
      toast.error("Edad inválida");
      return;
    }
    setLoading(true);
    try {
      await createUser({
        nombre: form.nombre,
        apellido: form.apellido,
        edad: edadNum,
        email: form.email,
        password: form.password,
        rol: form.rol,
        username: ""
      });
      toast.success("Usuario creado");
      navigate("/admin/users");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Nuevo usuario</h1>
            <p className="text-sm text-muted-foreground">Crea una cuenta para un nuevo usuario</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-md-custom">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuario *</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="h-11"
                placeholder="Ej: usuario123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad">Edad *</Label>
              <Input
                id="edad"
                name="edad"
                type="number"
                value={form.edad}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <Select
                value={form.rol}
                onValueChange={(value) => setForm({ ...form, rol: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col xs:flex-row gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 gap-2 shadow-primary" disabled={loading}>
                <Save className="h-4 w-4" />
                {loading ? "Creando..." : "Crear usuario"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUserNew;