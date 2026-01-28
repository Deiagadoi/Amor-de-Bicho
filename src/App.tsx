// src/App.tsx
import { useEffect, useState } from "react";
import { login } from "./services/authService";
import { getPets } from "./services/petsService";
import type { Pet } from "./services/petsService";

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await login("admin", "admin");
        const petsApi = await getPets();
        setPets(petsApi);
        console.log("Pets da API:", petsApi);
      } catch (err) {
  console.error("ERRO REAL:", err);
  setError("Não foi possível autenticar ou buscar pets");
      }
    };

    fetchData(); 
  }, []);
 
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pets</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="border p-4 rounded shadow">
            {pet.foto && (
              <img
                src={pet.foto}
                alt={pet.nome}
                className="w-full h-32 object-cover mb-2 rounded"
              />
            )}
            <h2 className="font-semibold">{pet.nome}</h2>
            <p>Espécie: {pet.especie}</p>
            <p>Idade: {pet.idade}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;