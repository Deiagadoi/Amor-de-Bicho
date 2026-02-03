import React from "react";
import {
  Navigate,
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Se não estiver autenticado, manda para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo / título clicável → leva para lista de pets */}
          <NavLink
            to="/pets"
            className="font-bold text-xl text-slate-800 hover:text-teal-700"
          >
            Amor de Bicho
          </NavLink>

          <nav className="flex items-center gap-4 text-sm font-medium">
            {/* Pets – fica ativo em /pets, /pets/novo, /pets/:id, etc */}
            <NavLink
              to="/pets"
              end={false}
              className={({ isActive }) =>
                `hover:text-teal-700 ${
                  isActive ? "text-teal-700" : "text-slate-700"
                }`
              }
            >
              Pets
            </NavLink>

            {/* Tutores – ativo em /tutores, /tutores/novo, /tutores/:id, /tutores/:id/pets */}
            <NavLink
              to="/tutores"
              end={false}
              className={({ isActive }) =>
                `hover:text-teal-700 ${
                  isActive ? "text-teal-700" : "text-slate-700"
                }`
              }
            >
              Tutores
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="ml-0 sm:ml-4 text-slate-500 hover:text-red-600"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
