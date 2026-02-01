import axios from "axios";

const API_BASE_URL = "https://pet-manager-api.geia.vip";

export interface Tutor {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  foto?: string; // a API espera string (URL da foto)
  pets?: { id: number; nome: string }[];
}

export const getTutors = async (): Promise<Tutor[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/tutores`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar tutores:", error);
    return [];
  }
};

export const getTutorById = async (id: number): Promise<Tutor | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/tutores/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar tutor ${id}:`, error);
    return null;
  }
};

export const createTutor = async (tutorData: FormData): Promise<Tutor | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/tutores`, tutorData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar tutor:", error);
    return null;
  }
};

export const updateTutor = async (id: number, tutorData: FormData): Promise<Tutor | null> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/v1/tutores/${id}`, tutorData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar tutor ${id}:`, error);
    return null;
  }
};

export const linkPetToTutor = async (tutorId: number, petId: number): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE_URL}/v1/tutores/${tutorId}/pets/${petId}`);
    return true;
  } catch (error: any) {
    console.error(`Erro ao vincular pet ${petId} ao tutor ${tutorId}:`, error);
    return false;
  }
};

export const unlinkPetFromTutor = async (tutorId: number, petId: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/v1/tutores/${tutorId}/pets/${petId}`);
    return true;
  } catch (error: any) {
    console.error(`Erro ao desvincular pet ${petId} do tutor ${tutorId}:`, error);
    return false;
  }
};
