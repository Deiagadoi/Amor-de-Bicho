import axios from "axios";

const API_BASE_URL = "https://pet-manager-api.geia.vip";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/autenticacao/login`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const token = response.data.accessToken || response.data.token;

    console.log("Login realizado com sucesso, token:", token);

    localStorage.setItem("token", token);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    return response.data;
  } catch (error) {
    console.error("Erro ao logar:", error);
    throw error;
  }
};