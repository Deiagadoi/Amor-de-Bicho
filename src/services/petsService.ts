// src/services/petsService.ts
import axios from "axios";

const API_BASE_URL = "https://pet-manager-api.geia.vip";

export interface Pet {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  foto?: string;
}

export const getPets = async (page = 1, limit = 10): Promise<Pet[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/pets`, {
      params: { page, limit },
    });
    return response.data; // Ajuste conforme a estrutura do retorno da API
  } catch (error: any) {
    console.error("Erro ao buscar pets:", error);
    return [];
  }
};
