// src/components/Tutors.tsx
import { useEffect, useState } from "react";
import {
  getTutors,
  linkPetToTutor,
  unlinkPetFromTutor,
} from "../services/tutorsService";
import type {Tutor} from "../services/tutorsService";
import { getPets } from "../services/petsService";
import type { Pet } from "../services/petsService";

export function Tutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar tutores e pets ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tutorsData = await getTutors();
        const petsData = await getPets(1, 50); // Pega até 50 pets
        setTutors(tutorsData);
        setPets(petsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar tutores ou pets");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Vincular pet a tutor
  const handleLinkPet = async (tutorId: number, petId: number) => {
    const success = await linkPetToTutor(tutorId, petId);
    if (success) {
      // Atualiza a lista local de tutores
      setTutors((prev) =>
        prev.map((t) =>
          t.id === tutorId
            ? {
                ...t,
                pets: t.pets ? [...t.pets, pets.find((p) => p.id === petId)!] : [pets.find((p) => p.id === petId)!],
              }
            : t
        )
      );
    }
  };

  // Desvincular pet do tutor
  const handleUnlinkPet = async (tutorId: number, petId: number) => {
    const success = await unlinkPetFromTutor(tutorId, petId);
    if (success) {
      setTutors((prev) =>
        prev.map((t) =>
          t.id === tutorId
            ? { ...t, pets: t.pets?.filter((p) => p.id !== petId) }
            : t
        )
      );
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tutores</h1>
      {tutors.map((tutor) => (
        <div key={tutor.id} className="border p-4 rounded mb-4 shadow">
          <h2 className="font-semibold">{tutor.nome}</h2>
          <p>Telefone: {tutor.telefone}</p>
          <p>Endereço: {tutor.endereco}</p>

          <div className="mt-2">
            <h3 className="font-semibold mb-1">Pets vinculados:</h3>
            <div className="flex flex-wrap gap-2">
              {tutor.pets && tutor.pets.length > 0 ? (
                tutor.pets.map((pet) => (
                  <div key={pet.id} className="border p-2 rounded">
                    {pet.nome}
                    <button
                      className="ml-2 text-red-500 font-bold"
                      onClick={() => handleUnlinkPet(tutor.id, pet.id)}
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p>Nenhum pet vinculado</p>
              )}
            </div>
          </div>

          <div className="mt-2">
            <h3 className="font-semibold mb-1">Vincular novo pet:</h3>
            <div className="flex flex-wrap gap-2">
              {pets
                .filter(
                  (p) =>
                    !tutor.pets?.some((tp) => tp.id === p.id)
                )
                .map((pet) => (
                  <button
                    key={pet.id}
                    className="border px-2 py-1 rounded bg-blue-500 text-white"
                    onClick={() => handleLinkPet(tutor.id, pet.id)}
                  >
                    {pet.nome}
                  </button>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
