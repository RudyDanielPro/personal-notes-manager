import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { fetchUsers, updateUser } from "@/lib/Api";
import { toast } from "sonner";

const AdminUserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    username: "",
    edad: "",
    email: "",
    password: "",
    rol: "USER",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const users = await fetchUsers();
        const user = users.find((u) => u.id === userId);
        if (!user) {
          toast.error("Usuario no encontrado");
          navigate("/admin/users");
          return;
        }
        setForm({
          nombre: user.nombre,
          apellido: user.apellido,
          username: user.username,
          edad: user.edad.toString(),
          email: user.email,
          password: "", 
          rol: user.rol,
        });
      } catch (error) {
        toast.error("Error al cargar usuario");
        navigate("/admin/users");
      } finally {
        setInitialLoading(false);
      }
    };
    loadUser();
  }, [userId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.username || !form.edad || !form.email) {
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
      await updateUser(userId, {
        nombre: form.nombre,
        apellido: form.apellido,
        edad: edadNum,
        email: form.email,
        password: form.password || undefined, // solo enviar si se cambió
        rol: form.rol,
      });
      toast.success("Usuario actualizado");
      navigate("/admin/users");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">Cargando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Editar usuario</h1>
            <p className="text-sm text-muted-foreground">Modifica los datos del usuario</p>
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
              <Label htmlFor="password">Contraseña (dejar vacío para no cambiar)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="h-11"
                placeholder="Nueva contraseña"
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
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUserEdit;