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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-slate-100 to-emerald-100">
      <div className="w-full max-w-5xl mx-4 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Lado esquerdo – texto e “branding” */}
          <div className="hidden md:flex flex-col justify-between bg-sky-900 text-sky-50 px-10 py-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-800/70 px-3 py-1 text-xs font-medium tracking-wide">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                Sistema de Registro de Pets
              </span>
             
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-sky-100/70">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-sky-700 border border-sky-600 flex items-center justify-center text-[10px] font-semibold">
                  🐶
                </div>
                <div className="h-8 w-8 rounded-full bg-sky-700 border border-sky-600 flex items-center justify-center text-[10px] font-semibold">
                  🐱
                </div>
              </div>
              <span>
                Acesso restrito a usuários autorizados.
                <br />
                Use suas credenciais fornecidas pela equipe.
              </span>
            </div>
          </div>

          {/* Lado direito – formulário */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-6 md:hidden">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Amor de Bicho
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Faça login para gerenciar Pets e Tutores.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700"
                >
                  Usuário
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-6 text-xs text-slate-400">
              Este ambiente é destinado exclusivamente à avaliação técnica.
              <br className="hidden sm:block" />
              Os dados de acesso devem ser utilizados de forma segura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
