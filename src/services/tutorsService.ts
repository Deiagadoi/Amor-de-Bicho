// src/services/tutorsService.ts
import { api } from "./api";
import type { Pet } from "./petsService";

export interface Tutor {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  fotoUrl?: string | null;
  pets?: Pet[];
}

export interface PagedTutors {
  content: Tutor[];
  totalPages: number;
  totalElements: number;
}

/* =========================================
   LISTAR TUTORES (com paginação da API)
========================================= */
export const getTutors = async (
  page = 0,
  size = 10,
  search = ""
): Promise<PagedTutors> => {
  const response = await api.get("/v1/tutores", {
    params: { page, size, search }
  });

  return response.data;
};

/* =========================================
   BUSCAR POR ID
========================================= */
export const getTutorById = async (id: number): Promise<Tutor> => {
  const response = await api.get(`/v1/tutores/${id}`);
  return response.data;
};

/* =========================================
   CRIAR
========================================= */
export const createTutor = async (data: FormData): Promise<Tutor> => {
  const response = await api.post("/v1/tutores", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
};

/* =========================================
   ATUALIZAR
========================================= */
export const updateTutor = async (
  id: number,
  data: FormData
): Promise<Tutor> => {
  const response = await api.put(`/v1/tutores/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
};

/* =========================================
   FOTO DO TUTOR
========================================= */
export const uploadTutorPhoto = async (
  tutorId: number,
  file: File
): Promise<void> => {

  const formData = new FormData();
  formData.append("foto", file);

  await api.post(`/v1/tutores/${tutorId}/fotos`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

/* =========================================
   VÍNCULO PET → TUTOR
========================================= */
export const linkPetToTutor = async (tutorId: number, petId: number) => {
  await api.post(`/v1/tutores/${tutorId}/pets/${petId}`);
};

export const unlinkPetFromTutor = async (tutorId: number, petId: number) => {
  await api.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
};

// NOVO
export const deleteTutor = async (id: number): Promise<void> => {
  await api.delete(`/v1/tutores/${id}`);
};