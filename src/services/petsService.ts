import { api } from "./api";

export interface PetPhoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: PetPhoto | null;

  tutores?: Array<{
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    email: string;
    cpf: number;
  }>;
  fotoUrl?: string | null;
}

/** LISTAR PETS (com paginação e busca) */
export const getPets = async (page: number = 0, search: string = "") => {
  const params: any = { page, size: 10 };
  if (search) params.nome = search;

  const response = await api.get("/v1/pets", { params });

  const pets = response.data.content.map((p: Pet) => ({
    ...p,
    fotoUrl: p.foto?.url ?? null,
  }));

  return {
    ...response.data,
    content: pets,
  };
};

/** BUSCAR PET POR ID */
export const getPetById = async (id: number): Promise<Pet> => {
  const response = await api.get(`/v1/pets/${id}`);
  const pet = response.data;

  return {
    ...pet,
    fotoUrl: pet.foto?.url ?? null,
  };
};

/** CRIAR PET */
export const createPet = async (data: {
  nome: string;
  idade: number;
  raca: string;
}) => {
  const resp = await api.post("/v1/pets", data);
  return resp.data;
};

/** ATUALIZAR PET */
export const updatePet = async (
  id: number,
  data: { nome: string; idade: number; raca: string }
) => {
  const resp = await api.put(`/v1/pets/${id}`, data);
  return resp.data;
};

export const uploadPetPhoto = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("foto", file);

  const resp = await api.post(`/v1/pets/${id}/fotos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return resp.data;
};

export const deletePet = async (id: number): Promise<void> => {
  await api.delete(`/v1/pets/${id}`);
};