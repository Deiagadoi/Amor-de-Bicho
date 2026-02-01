import React, { useEffect, useState } from "react";
import { getPets } from "../services/petsService";
import type { Pet } from "../services/petsService";
export const PetsPage: React.FC = () => {
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
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, [page, search]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Pets</h1>

      <input
        type="text"
        placeholder="Buscar por nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full max-w-md shadow-sm"
      />

      {loading && <p className="text-slate-500">Carregando pets...</p>}

     
      {!loading && pets.length === 0 && (
        <p className="text-slate-500">Nenhum pet encontrado.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading &&
          pets.map((pet) => (
            <div
              key={pet.id}
              className="border rounded-lg shadow p-4 bg-white hover:shadow-md transition cursor-pointer"
            >
              <img
                src={pet.fotoUrl || "https://via.placeholder.com/150"}
                alt={pet.nome}
                className="rounded w-full h-40 object-cover mb-3"
              />

              <h2 className="text-xl font-semibold">{pet.nome}</h2>
              <p className="text-sm text-slate-600">Espécie: {pet.especie}</p>
              <p className="text-sm text-slate-600">Idade: {pet.idade} anos</p>
            </div>
          ))}
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span>
          Página {page + 1} de {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};
