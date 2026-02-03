import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTutorById, linkPetToTutor, unlinkPetFromTutor } from "../services/tutorsService";
import { getPets } from "../services/petsService";
import type { Tutor } from "../services/tutorsService";
import type { Pet } from "../services/petsService";

export const TutorPetsPage: React.FC = () => {
  const { id } = useParams();
  const tutorId = Number(id);

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Carrega tutor + lista de pets
  useEffect(() => {
    const loadData = async () => {
      if (!tutorId) return;

      try {
        setLoading(true);

        const tutorData = await getTutorById(tutorId);
        setTutor(tutorData);

        // busca a primeira página de pets para vinculação
        const petsResponse = await getPets(0, "");
        setAllPets(petsResponse.content ?? petsResponse);
      } catch (error) {
        console.error("Erro ao carregar dados do tutor/pets:", error);
        alert("Erro ao carregar dados do tutor e pets.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [tutorId]);

  const linkedPets = tutor?.pets ?? [];

  // Filtra pets disponíveis pela busca
  const filteredPets: Pet[] = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allPets;

    return allPets.filter((p) => p.nome.toLowerCase().includes(term));
  }, [allPets, search]);

  const isPetLinked = (petId: number) =>
    linkedPets.some((lp) => lp.id === petId);

  const handleLink = async (petId: number) => {
    if (!tutorId) return;

    try {
      setSaving(true);
      await linkPetToTutor(tutorId, petId);

      // atualiza tutor em memória
      const pet = allPets.find((p) => p.id === petId);
      if (pet) {
        setTutor((prev) =>
          prev
            ? {
                ...prev,
                pets: [...(prev.pets ?? []), { id: pet.id, nome: pet.nome }],
              }
            : prev
        );
      }
    } catch (error) {
      console.error("Erro ao vincular pet:", error);
      alert("Erro ao vincular pet ao tutor.");
    } finally {
      setSaving(false);
    }
  };

  const handleUnlink = async (petId: number) => {
    if (!tutorId) return;

    if (!confirm("Deseja realmente remover esse vínculo?")) return;

    try {
      setSaving(true);
      await unlinkPetFromTutor(tutorId, petId);

      setTutor((prev) =>
        prev
          ? {
              ...prev,
              pets: (prev.pets ?? []).filter((p) => p.id !== petId),
            }
          : prev
      );
    } catch (error) {
      console.error("Erro ao remover vínculo:", error);
      alert("Erro ao remover vínculo do pet.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-6">
        <p className="text-slate-500">Carregando dados do tutor...</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="max-w-5xl mx-auto py-6 space-y-2">
        <p className="text-red-600 font-semibold">
          Tutor não encontrado.
        </p>
        <Link
          to="/tutores"
          className="text-sky-600 hover:underline text-sm"
        >
          ← Voltar para lista de tutores
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-4">
      {/* Link voltar */}
      <Link
        to="/tutores"
        className="text-sky-600 hover:text-sky-800 text-sm font-semibold inline-flex items-center"
      >
        ← Voltar para lista de tutores
      </Link>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Gerenciar Pets do Tutor
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Tutor: <span className="font-semibold">{tutor.nome}</span>
            </p>
          </div>

          {saving && (
            <span className="text-xs text-amber-600 font-medium">
              Salvando alterações...
            </span>
          )}
        </div>

        {/* Bloco 1: Pets vinculados */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Pets vinculados
          </h2>

          {linkedPets.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum pet vinculado a este tutor.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {linkedPets.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {pet.nome}
                    </p>
                    <p className="text-xs text-slate-500">
                      ID: {pet.id}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUnlink(pet.id)}
                    disabled={saving}
                    className="text-xs rounded-md bg-rose-50 px-3 py-1 font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr className="border-slate-200" />

        {/* Bloco 2: Vincular novo pet */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Vincular novo Pet
            </h2>

            <input
              type="text"
              placeholder="Buscar pet por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full sm:w-72 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          {filteredPets.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum pet encontrado para vinculação.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {filteredPets.map((pet) => {
                const alreadyLinked = isPetLinked(pet.id);

                return (
                  <div
                    key={pet.id}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {pet.nome}
                      </p>
                      <p className="text-xs text-slate-500">
                        Raça: {pet.raca || "-"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Idade: {pet.idade} anos
                      </p>
                    </div>

                    <div className="mt-3">
                      {alreadyLinked ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          Já vinculado
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLink(pet.id)}
                          disabled={saving}
                          className="w-full rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          Vincular
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
