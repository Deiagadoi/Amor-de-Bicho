import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createPet,
  updatePet,
  getPetById,
  uploadPetPhoto,
} from "../services/petsService";

export const PetFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nome: "",
    raca: "",
    idade: "",
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const pet = await getPetById(Number(id));
        setForm({
          nome: pet.nome,
          raca: pet.raca ?? "",
          idade: String(pet.idade),
        });
      } catch (err) {
        console.error("Erro ao carregar pet:", err);
        alert("Erro ao carregar dados do pet.");
      }
    };

    void load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let petId = Number(id);

      if (!form.nome.trim() || !form.raca.trim()) {
        alert("Nome e Raça/Espécie são obrigatórios.");
        setLoading(false);
        return;
      }

      const idadeNumber = Number(form.idade);
      if (Number.isNaN(idadeNumber) || idadeNumber < 0) {
        alert("Informe uma idade válida.");
        setLoading(false);
        return;
      }

      if (!id) {
        const resp = await createPet({
          nome: form.nome.trim(),
          idade: idadeNumber,
          raca: form.raca.trim(),
        });
        petId = resp.id;
      } else {
        await updatePet(petId, {
          nome: form.nome.trim(),
          idade: idadeNumber,
          raca: form.raca.trim(),
        });
      }

      if (fotoFile) {
        try {
          await uploadPetPhoto(petId, fotoFile);
        } catch (err) {
          console.error("Erro ao enviar foto do pet:", err);
          alert(
            "Pet salvo com sucesso, mas ocorreu um erro ao enviar a foto. Você pode atualizar a foto depois."
          );
        }
      }

      alert("Pet salvo com sucesso!");
      navigate("/pets");
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      alert("Erro ao salvar pet. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
      <Link
        to="/pets"
        className="text-sky-600 hover:text-sky-800 text-sm font-semibold inline-flex items-center mb-4"
      >
        ← Voltar para lista
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        {id ? "Editar Pet" : "Cadastrar Novo Pet"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block mb-1 font-medium"
          >
            Nome
          </label>
          <input
            id="nome"
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        <div>
          <label
            htmlFor="raca"
            className="block mb-1 font-medium"
          >
            Raça / Espécie
          </label>
          <input
            id="raca"
            type="text"
            name="raca"
            value={form.raca}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        <div>
          <label
            htmlFor="idade"
            className="block mb-1 font-medium"
          >
            Idade
          </label>
          <input
            id="idade"
            type="number"
            min="0"
            name="idade"
            value={form.idade}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        <div>
          <label
            htmlFor="foto"
            className="block mb-1 font-medium"
          >
            Foto (opcional)
          </label>
          <input
            id="foto"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFotoFile(e.target.files ? e.target.files[0] : null)
            }
            className="w-full text-sm"
          />
          {fotoFile && (
            <p className="mt-1 text-xs text-slate-500">
              Arquivo selecionado: {fotoFile.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};
