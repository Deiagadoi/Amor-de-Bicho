// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Verificando autenticação...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};
