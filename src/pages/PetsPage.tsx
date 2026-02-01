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
  const navigate = useNavigate(); // 👈

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

  const handleCardClick = (id: number) => {
    navigate(`/pets/${id}`);
  };

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

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <div
            key={pet.id}
            onClick={() => navigate(`/pets/${pet.id}`)}
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
            </div>
          </div>

        ))}
    </div>


      {/* Paginação igual você já tinha */}
    </div>
  );
};
