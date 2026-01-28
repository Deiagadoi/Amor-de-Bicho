import axios from "axios";

export const api = axios.create({
  baseURL: "https://pet-manager-api.geia.vip",
});

// Interceptor para sempre enviar token se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});