import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute"; // Nuevo
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NoteNew from "./pages/NoteNew";
import NoteDetail from "./pages/NoteDetail";
import NoteEdit from "./pages/NoteEdit";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// Importar páginas de administración
import AdminUsers from "./pages/AdminUsers";
import AdminUserNew from "./pages/AdminUserNew";
import AdminUserEdit from "./pages/AdminUserEdit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotesProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/notes/new" element={<ProtectedRoute><NoteNew /></ProtectedRoute>} />
              <Route path="/notes/:id" element={<ProtectedRoute><NoteDetail /></ProtectedRoute>} />
              <Route path="/notes/:id/edit" element={<ProtectedRoute><NoteEdit /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              
              <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
              <Route path="/admin/users/new" element={<ProtectedAdminRoute><AdminUserNew /></ProtectedAdminRoute>} />
              <Route path="/admin/users/:id/edit" element={<ProtectedAdminRoute><AdminUserEdit /></ProtectedAdminRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;