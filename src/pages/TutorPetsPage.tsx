import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getTutorById,
  linkPetToTutor,
  unlinkPetFromTutor,
} from "../services/tutorsService";


import type { Tutor } from "../services/tutorsService";


import { getPets } from "../services/petsService";
import type { Pet } from "../services/petsService";

export const TutorPetsPage: React.FC = () => {
  const { id } = useParams();
  const tutorId = Number(id);

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [linkedPets, setLinkedPets] = useState<{ id: number; nome: string }[]>(
    []
  );
  const [availablePets, setAvailablePets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [searchPet, setSearchPet] = useState("");

  // Carregar dados do tutor + pets vinculados
  const loadTutorAndLinkedPets = async () => {
    if (!tutorId) return;

    try {
      
      setLoading(true);
      const tutorData = await getTutorById(tutorId);
      setTutor(tutorData);
      setLinkedPets(tutorData.pets ?? []);
    } catch (error) {
      console.error("Erro ao carregar tutor:", error);
      alert("Erro ao carregar dados do tutor.");
    } finally {
      setLoading(false);
    }
  };

  // Carregar lista de pets para vincular
  const loadAvailablePets = async () => {
    try {
      const resp = await getPets(0, searchPet);
      setAvailablePets(resp.content);
    } catch (error) {
      console.error("Erro ao carregar lista de pets para vincular:", error);
    }
  };

  useEffect(() => {
    void loadTutorAndLinkedPets();
  }, [tutorId]);

  useEffect(() => {
    void loadAvailablePets();
  }, [searchPet]);

  const handleLinkPet = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tutorId || !selectedPetId) {
      alert("Selecione um pet para vincular.");
      return;
    }

    try {
      setLinking(true);
      const petId = Number(selectedPetId);

      await linkPetToTutor(tutorId, petId);

      const pet = availablePets.find((p) => p.id === petId);

      if (pet) {
        setLinkedPets((prev) => {
          const jaExiste = prev.some((lp) => lp.id === pet.id);
          if (jaExiste) return prev;
          return [...prev, { id: pet.id, nome: pet.nome }];
        });
      }

      alert("Pet vinculado ao tutor com sucesso!");
      setSelectedPetId("");
    } catch (error) {
      console.error("Erro ao vincular pet ao tutor:", error);
      alert("Erro ao vincular pet. Tente novamente.");
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkPet = async (petId: number) => {
    if (!tutorId) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja remover o vínculo deste pet com o tutor?"
    );

    if (!confirmar) return;

    try {
      await unlinkPetFromTutor(tutorId, petId);

      setLinkedPets((prev) => prev.filter((p) => p.id !== petId));

      alert("Vínculo removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover vínculo:", error);
      alert("Erro ao remover vínculo. Tente novamente.");
    }
  };

  if (!tutorId) {
    return (
      <div className="p-4">
        <p className="text-red-600 text-sm">
          ID do tutor inválido na URL.
        </p>
      </div>
    );
  }

  if (loading && !tutor) {
    return (
      <div className="p-4">
        <p className="text-slate-500 text-sm">
          Carregando dados do tutor...
        </p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="p-4">
        <p className="text-red-600 text-sm">
          Tutor não encontrado.
        </p>
        <Link
          to="/tutores"
          className="text-sky-600 hover:underline text-sm mt-2 inline-block"
        >
          ← Voltar para lista de tutores
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
     
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            to="/tutores"
            className="text-sky-600 hover:underline text-sm inline-flex items-center gap-1"
          >
            ← Voltar para lista de tutores
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">
            Gerenciar Pets do Tutor
          </h1>
          <p className="text-sm text-slate-500">
            Tutor: <span className="font-semibold">{tutor.nome}</span>
          </p>
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-lg font-semibold mb-3">
            Pets vinculados a {tutor.nome}
          </h2>

          {linkedPets.length === 0 && (
            <p className="text-sm text-slate-500">
              Nenhum pet vinculado a este tutor.
            </p>
          )}

          {linkedPets.length > 0 && (
            <ul className="space-y-2">
              {linkedPets.map((pet) => (
                <li
                  key={pet.id}
                  className="flex items-center justify-between text-sm border border-slate-100 rounded-lg px-3 py-2"
                >
                  <span>{pet.nome}</span>
                  <button
                    type="button"
                    onClick={() => void handleUnlinkPet(pet.id)}
                    className="text-red-600 hover:underline text-xs font-semibold"
                  >
                    Remover vínculo
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

       
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
          <h2 className="text-lg font-semibold">
            Vincular novo pet a {tutor.nome}
          </h2>

       
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Buscar pets pelo nome
            </label>
            <input
              type="text"
              value={searchPet}
              onChange={(e) => setSearchPet(e.target.value)}
              placeholder="Digite o nome do pet..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
            <p className="mt-1 text-xs text-slate-500">
              A lista abaixo será filtrada por este nome.
            </p>
          </div>

          <form onSubmit={handleLinkPet} className="space-y-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Selecionar pet
              </label>
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              >
                <option value="">-- Selecione um pet --</option>
                {availablePets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.nome} {pet.raca ? `(${pet.raca})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={linking}
              className="inline-flex items-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {linking ? "Vinculando..." : "Vincular pet ao tutor"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
