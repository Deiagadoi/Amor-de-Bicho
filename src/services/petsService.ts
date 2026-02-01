import { api } from "./api";

export interface Pet {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  fotoUrl?: string;
}

export const getPets = async (page: number, search: string) => {
  const params: any = {
    page,
    size: 10,
  };

  if (search) {
    params.nome = search;
  }

  const response = await api.get("/v1/pets", { params });

  return response.data; 
};
