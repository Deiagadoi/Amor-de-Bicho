import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPetById } from "../services/petsService";
import type { Pet } from "../services/petsService";
import { getTutorById } from "../services/tutorsService";
import type { Tutor } from "../services/tutorsService";

export const PetDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const petData = await getPetById(Number(id));
        setPet(petData);

        // ✅ usa 'tutores' em vez de 'tutorIds'
        const firstTutorId = petData.tutores?.[0]?.id;
        if (firstTutorId) {
          const tutorData = await getTutorById(firstTutorId);
          setTutor(tutorData);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do pet:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Carregando detalhes do pet...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="p-6">
        <p className="text-red-600">Pet não encontrado.</p>
        <Link
          to="/pets"
          className="text-sky-600 hover:underline text-sm mt-2 inline-block"
        >
          Voltar para lista de pets
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to="/pets"
        className="text-sky-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Voltar para lista de pets
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex justify-center">
          <div className="w-full max-w-xs h-64 overflow-hidden rounded-xl border shadow-sm">
            <img
              src={pet.fotoUrl || "https://via.placeholder.com/300"}
              alt={pet.nome}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:w-2/3 space-y-3">
          {/* 🔹 Destaque ao nome do pet (requisito do edital) */}
          <h1 className="text-3xl font-extrabold text-slate-900">
            {pet.nome}
          </h1>

          <p className="text-sm text-slate-600">
            <span className="font-semibold">Raça / Espécie:</span> {pet.raca}
          </p>
          <p className="text-sm text-slate-600">
            <span className="font-semibold">Idade:</span> {pet.idade} anos
          </p>

          {tutor && (
            <div className="mt-4 border-t pt-4">
              <h2 className="text-lg font-bold mb-2">Tutor</h2>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Nome:</span> {tutor.nome}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Telefone:</span>{" "}
                {tutor.telefone}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Endereço:</span>{" "}
                {tutor.endereco}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
