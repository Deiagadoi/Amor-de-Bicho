import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "/api";
// const API_BASE_URL = "https://pet-manager-api.geia.vip";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Controle para evitar múltiplos refresh ao mesmo tempo
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor de REQUEST → adiciona Authorization em todas as chamadas (menos login/refresh)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    const isAuthRequest =
      config.url?.includes("/autenticacao/login") ||
      config.url?.includes("/autenticacao/refresh");

    if (!isAuthRequest && token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPONSE → trata 401 e tenta refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se não for 401, ou já tentamos refresh, só repassa o erro
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");

    // Se não tiver refresh token, não tem o que fazer → rejeita
    if (!refreshToken) {
      processQueue(error, null);
      return Promise.reject(error);
    }

    // Se já estiver atualizando, coloca essa requisição na fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: unknown) => {
            if (typeof token === "string" && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // ⚠️ AQUI é o ponto crítico: endpoint e campo "refresh_token"
      const response = await api.put("/v1/autenticacao/refresh", {
        refresh_token: refreshToken,
      });

      const {
        access_token,
        refresh_token,
      }: {
        access_token: string;
        refresh_token?: string;
      } = (response.data || {}) as any;

      if (!access_token) {
        throw new Error("Novo token de acesso não retornado no refresh.");
      }

      // Salva novos tokens
      localStorage.setItem("token", access_token);
      if (refresh_token) {
        localStorage.setItem("refreshToken", refresh_token);
      }

      // Atualiza Authorization padrão do axios
      api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

      // Libera a fila de requisições pendentes
      processQueue(null, access_token);

      // Atualiza a requisição original e reenvia
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }

      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);

      // Se o refresh falhar, limpa os tokens → usuário terá que logar de novo
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
