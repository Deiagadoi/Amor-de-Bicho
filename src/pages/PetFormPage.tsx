import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createPet,
  updatePet,
  getPetById,
  uploadPetPhoto,
} from "../services/petsService";
import type { AxiosError } from "axios";

export const PetFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // se existir = edição

  const [form, setForm] = useState({
    nome: "",
    raca: "",
    idade: "",
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Se tiver ID → carregar dados do pet para edição
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
        alert("Não foi possível carregar os dados do pet.");
      }
    };

    load();
  }, [id]);

  // Atualiza campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Salvar (criar ou editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações simples
    if (!form.nome.trim() || !form.raca.trim()) {
      alert("Nome e Raça/Espécie são obrigatórios.");
      return;
    }

    if (
      form.idade === "" ||
      Number.isNaN(Number(form.idade)) ||
      Number(form.idade) < 0
    ) {
      alert("Informe uma idade válida (número inteiro maior ou igual a 0).");
      return;
    }

    setLoading(true);

    try {
      let petId = Number(id);

      if (!id) {
        // Criar pet
        const resp = await createPet({
          nome: form.nome.trim(),
          idade: Number(form.idade),
          raca: form.raca.trim(),
        });
        petId = resp.id;
      } else {
        // Atualizar pet
        await updatePet(petId, {
          nome: form.nome.trim(),
          idade: Number(form.idade),
          raca: form.raca.trim(),
        });
      }

      // Upload da foto (se selecionada)
      if (fotoFile) {
        try {
          await uploadPetPhoto(petId, fotoFile);
        } catch (erroUpload) {
          console.error("Erro ao enviar foto do pet:", erroUpload);
          alert(
            "Pet salvo, mas ocorreu um erro ao enviar a foto. Você pode tentar atualizar a foto depois."
          );
          navigate("/pets");
          return;
        }
      }

      alert("Pet salvo com sucesso!");
      navigate("/pets");
    } catch (error) {
      console.error("Erro ao salvar pet:", error);

      let mensagem = "Erro ao salvar pet.";
      const axiosError = error as AxiosError<any>;

      if (axiosError.response?.data) {
        const data = axiosError.response.data as any;
        mensagem =
          data.mensagem ||
          data.message ||
          data.error ||
          data.detalhe ||
          mensagem;
      }

      alert(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <Link
        to="/pets"
        className="text-sky-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Voltar para lista de pets
      </Link>
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Editar Pet" : "Cadastrar Novo Pet"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Raça / Espécie</label>
          <input
            type="text"
            name="raca"
            value={form.raca}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Idade</label>
          <input
            type="number"
            min="0"
            name="idade"
            value={form.idade}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Foto (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFotoFile(e.target.files ? e.target.files[0] : null)
            }
            className="w-full"
          />
          {fotoFile && (
            <p className="text-xs text-slate-500 mt-1">
              Arquivo selecionado: {fotoFile.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};
