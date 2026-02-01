import { api } from "./api";
import axios from "axios";

// Resposta EXATA da API
interface LoginApiResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

// O que você quer usar na aplicação
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginApiResponse>(
      "/autenticacao/login",
      {
        username,
        password,
      }
    );

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
    } = response.data;

    if (!access_token) {
      throw new Error("Token de acesso não encontrado na resposta.");
    }

    localStorage.setItem("token", access_token);
    if (refresh_token) {
      localStorage.setItem("refreshToken", refresh_token);
    }

    api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

    console.log("Login realizado com sucesso.");

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
      refreshExpiresIn: refresh_expires_in,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao logar - status:", error.response?.status);
      console.error("Resposta da API:", error.response?.data);

      const mensagemApi =
        (error.response?.data as any)?.mensagem ||
        (error.response?.data as any)?.message;

      throw new Error(mensagemApi || "Erro ao realizar login.");
    }

    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  delete api.defaults.headers.common.Authorization;
};
