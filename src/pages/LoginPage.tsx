import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const from = state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao realizar login. Tente novamente.";
      alert(message);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-sky-900 px-4 text-slate-900 overflow-hidden">
      {/* fundo azul com detalhe no canto inferior direito */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 right-0 w-56 h-40 opacity-30">
          <div className="absolute bottom-4 right-0 h-1 w-40 bg-sky-800 rounded-full" />
          <div className="absolute bottom-7 right-4 h-1 w-36 bg-sky-800 rounded-full" />
          <div className="absolute bottom-10 right-8 h-1 w-32 bg-sky-800 rounded-full" />
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="mx-auto rounded-3xl bg-white shadow-xl border border-sky-100 px-8 py-8 sm:px-10 sm:py-9">
          <h1 className="mb-6 text-center text-sm font-medium text-slate-600">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuário */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-medium text-slate-600"
              >
                Login
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  className="w-full rounded-full border border-sky-100 bg-sky-50 px-4 pr-10 py-2.5 text-sm text-slate-700 placeholder:text-sky-300 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  placeholder="Login"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-600"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-full border border-sky-100 bg-sky-50 px-4 pr-10 py-2.5 text-sm text-slate-700 placeholder:text-sky-300 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="Senha"
                />
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Login"}
            </button>
          </form>
        </div>

        {/* Rodapé parecido com o modelo */}
        <div className="mt-6 text-center text-[11px] text-sky-100 space-y-1">
          <p>Amor de Bicho - Sistema de Gestão de Pets e Tutores</p>
          <p>
            Suporte:{" "}
            <span className="underline underline-offset-2">
              contato@amordebicho.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

