// import { api } from "./api";

// export interface Pet {
//   id: number;
//   nome: string;
//   especie: string;
//   idade: number;
//   foto?: string;
// }

// export const getPets = async (page: number, search: string) => {
//   const params: any = {
//     page,
//     size: 10,
//   };

//   if (search) {
//     params.nome = search;
//   }

//   const response = await api.get("/v1/pets", { params });

//   return response.data; 
// };

// export const getPetById = async (id: number): Promise<Pet> => {
//   const response = await api.get(`/v1/pets/${id}`);
//   return response.data;
// };
import { api } from "./api";

// Formato que vem da API
interface PetApi {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: {
    id: number;
    nome: string;
    contentType: string;
    url: string;
  };
  tutores?: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: number;
    foto?: {
      id: number;
      nome: string;
      contentType: string;
      url: string;
    };
  }[];
}

// Formato que vamos usar no front
export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  fotoUrl?: string;
  tutorIds: number[]; // para buscar tutor depois, se quiser
}

const mapPet = (data: PetApi): Pet => ({
  id: data.id,
  nome: data.nome,
  raca: data.raca,
  idade: data.idade,
  fotoUrl: data.foto?.url,             // 👈 AQUI está a URL da foto
  tutorIds: data.tutores?.map((t) => t.id) ?? [],
});

export const getPets = async (page: number, search: string) => {
  const params: any = {
    page,
    size: 10,
  };

  if (search) {
    params.nome = search;
  }

  const response = await api.get("/v1/pets", { params });

  const content = (response.data.content as PetApi[]).map(mapPet);

  return {
    ...response.data,
    content,
  };
};

export const getPetById = async (id: number): Promise<Pet> => {
  const response = await api.get(`/v1/pets/${id}`);
  return mapPet(response.data as PetApi);
};
