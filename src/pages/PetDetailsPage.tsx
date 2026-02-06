import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPetById } from "../services/petsService";
import type { Pet } from "../services/petsService";
import { getTutorById } from "../services/tutorsService";
import type { Tutor } from "../services/tutorsService";

export const PetDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTutor, setLoadingTutor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("ID do pet inválido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const petData = await getPetById(Number(id));
        setPet(petData);

       
        const firstTutorId = petData.tutores?.[0]?.id;
        if (firstTutorId) {
          try {
            setLoadingTutor(true);
            const tutorData = await getTutorById(firstTutorId);
            setTutor(tutorData);
          } finally {
            setLoadingTutor(false);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes do pet:", err);
        setError("Erro ao carregar detalhes do pet.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [id]);

  if (loading && !pet) {
    return (
      <div className="p-6">
        <p className="text-slate-500 text-sm">
          Carregando detalhes do pet...
        </p>
      </div>
    );
  }

  if (error && !pet) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-red-600 text-sm">{error}</p>
        <Link
          to="/pets"
          className="text-sky-600 hover:underline text-sm inline-flex items-center"
        >
          ← Voltar para lista de pets
        </Link>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-sm">Pet não encontrado.</p>
        <Link
          to="/pets"
          className="text-sky-600 hover:underline text-sm mt-2 inline-block"
        >
          ← Voltar para lista de pets
        </Link>
      </div>
    );
  }


  const fotoSrc =
    (pet as any).fotoUrl ||
    pet.foto?.url ||
    "https://via.placeholder.com/300";

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to="/pets"
          className="text-sky-600 hover:underline text-sm inline-flex items-center"
        >
          ← Voltar para lista de pets
        </Link>

        <button
          type="button"
          onClick={() => navigate(`/pets/${pet.id}/editar`)}
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Editar Pet
        </button>
      </div>

    
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 md:p-6 flex flex-col md:flex-row gap-6">
        
        <div className="md:w-1/3 flex justify-center">
          <div className="w-full max-w-xs">
         
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border shadow-sm bg-slate-100">
              <img
                src={fotoSrc}
                alt={pet.nome}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

       
        <div className="md:w-2/3 space-y-3">
          
          <div>
            <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 mb-2">
              Pet
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              {pet.nome}
            </h1>
          </div>

          <p className="text-sm text-slate-600">
            <span className="font-semibold">Raça / Espécie:</span>{" "}
            {pet.raca || "-"}
          </p>
          <p className="text-sm text-slate-600">
            <span className="font-semibold">Idade:</span> {pet.idade} anos
          </p>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            ID interno: {pet.id}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-slate-100 p-4 md:p-5 space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Tutor</h2>

        {loadingTutor && (
          <p className="text-xs text-slate-500">
            Carregando dados do tutor...
          </p>
        )}

        {!loadingTutor && !tutor && (
          <p className="text-xs text-slate-500">
            Nenhum tutor vinculado a este pet.
          </p>
        )}

        {tutor && (
          <div className="space-y-1 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Nome:</span> {tutor.nome}
            </p>
            <p>
              <span className="font-semibold">Telefone:</span>{" "}
              {tutor.telefone || "-"}
            </p>
            <p>
              <span className="font-semibold">Endereço:</span>{" "}
              {tutor.endereco || "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
