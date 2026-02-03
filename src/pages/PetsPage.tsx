import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPets } from "../services/petsService";
import type { Pet } from "../services/petsService";

export const PetsPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadPets = async () => {
    try {
      setLoading(true);
      const data = await getPets(page, search);
      setPets(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleCardClick = (id: number) => {
    navigate(`/pets/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Pets</h1>

      {/* Botão de novo pet */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/pets/novo")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Novo Pet
        </button>
      </div>

      {/* Busca por nome */}
      <input
        type="text"
        placeholder="Buscar por nome..."
        value={search}
        onChange={(e) => {
          setPage(0); // sempre volta pra primeira página ao buscar
          setSearch(e.target.value);
        }}
        className="border p-2 rounded mb-4 w-full max-w-md shadow-sm"
      />

      {loading && <p className="text-slate-500">Carregando pets...</p>}

      {!loading && pets.length === 0 && (
        <p className="text-slate-500">Nenhum pet encontrado.</p>
      )}

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <div
            key={pet.id}
            onClick={() => handleCardClick(pet.id)} // 👈 agora usa a função
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer flex flex-col overflow-hidden"
          >
            {/* Área da imagem com tamanho fixo */}
            <div className="w-full h-40 overflow-hidden">
              <img
                src={pet.fotoUrl || "https://via.placeholder.com/150"}
                alt={pet.nome}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Área de texto */}
            <div className="p-3">
              <h2 className="font-bold text-lg">{pet.nome}</h2>
              <p className="text-sm text-slate-600">Raça: {pet.raca}</p>
              <p className="text-sm text-slate-600">Idade: {pet.idade} anos</p>

              {/* Botão de edição */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // não abre o detalhe
                  navigate(`/pets/${pet.id}/editar`);
                }}
                className="text-blue-600 hover:underline text-sm mt-2"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {!loading && pets.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span className="text-sm text-slate-600">
            Página {page + 1} de {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() =>
              setPage((prev) =>
                prev + 1 < totalPages ? prev + 1 : prev
              )
            }
            className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};
