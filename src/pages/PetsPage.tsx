import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPets, deletePet } from "../services/petsService";
import type { Pet } from "../services/petsService";

export const PetsPage: React.FC = () => {
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const loadPets = async () => {
    try {
      setLoading(true);
      const data = await getPets(page, search);
      setPets(data.content);
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
      alert("Erro ao carregar lista de pets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPets();

  }, [page, search]);

  const handleCardClick = (id: number) => {
    navigate(`/pets/${id}`);
  };

  const handleNewPet = () => {
    navigate("/pets/novo");
  };

    const handleLisTutor = () => {
    navigate("/tutores");
  };

  // 🗑️ Excluir pet
  const handleDeletePet = async (pet: Pet) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o pet "${pet.nome}"?`
    );

    if (!confirmar) return;

    try {
      await deletePet(pet.id);

      setPets((prev) => prev.filter((p) => p.id !== pet.id));

      alert("Pet excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      alert("Erro ao excluir pet. Tente novamente.");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Pets
          </h1>
          <p className="text-sm text-slate-500">
            Registro público de pets – cadastre, visualize e gerencie.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLisTutor}
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          👤 Listar Tutores
        </button>

        <button
          type="button"
          onClick={handleNewPet}
          className="inline-flex items-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          + Novo Pet
        </button>
      </div>

      {/* Filtro de busca */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Buscar pet por nome..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
          <p className="mt-1 text-xs text-slate-400">
            A busca é enviada para a API filtrando pelo nome.
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-56 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && pets.length === 0 && (
        <p className="text-slate-500 text-sm">
          Nenhum pet encontrado para os filtros informados.
        </p>
      )}

      {!loading && pets.length > 0 && (
        <>
          {/* Grid de cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((pet) => {
              const fotoSrc =
                (pet as any).fotoUrl ||
                pet.foto?.url ||
                "/img/pet-placeholder.jpg";

              return (
                <div
                  key={pet.id}
                  onClick={() => handleCardClick(pet.id)}
                  className="bg-white rounded-xl shadow border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer flex flex-col overflow-hidden"
                >
                  {/* Área da imagem */}
                  <div className="w-full h-40 md:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={fotoSrc}
                      alt={pet.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Área de texto */}
                  <div className="p-3 space-y-1">
                    <h2 className="font-bold text-lg truncate text-slate-800">
                      {pet.nome}
                    </h2>
                    <p className="text-xs text-slate-600">
                      Raça / espécie: {pet.raca || "-"}
                    </p>
                    <p className="text-xs text-slate-600">
                      Idade: {pet.idade} ano(s)
                    </p>

                    <div className="mt-2 flex gap-3">
                      {/* Editar */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/pets/${pet.id}/editar`);
                        }}
                        className="text-xs font-semibold text-teal-700 hover:underline"
                      >
                        Editar
                      </button>

                      {/* Excluir */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDeletePet(pet);
                        }}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginação */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-slate-600">
              Página <strong>{page + 1}</strong> de{" "}
              <strong>{totalPages}</strong>
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((old) => Math.max(0, old - 1))}
                className="px-3 py-1 rounded border text-sm bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>

              <button
                type="button"
                disabled={page + 1 >= totalPages}
                onClick={() =>
                  setPage((old) => (old + 1 < totalPages ? old + 1 : old))
                }
                className="px-3 py-1 rounded border text-sm bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
