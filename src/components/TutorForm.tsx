// src/components/TutorForm.tsx
import { useState, useEffect } from "react";
import {
  createTutor,
  updateTutor,
  getTutorById
} from "../services/tutorsService";
import type { Tutor } from "../services/tutorsService";
interface TutorFormProps {
  tutorId?: number; // se existir, é edição
  onSuccess?: () => void; // callback após salvar
}

export function TutorForm({ tutorId, onSuccess }: TutorFormProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Se for edição, busca os dados do tutor
  useEffect(() => {
    if (tutorId) {
      const fetchTutor = async () => {
        try {
          const data = await getTutorById(tutorId);
          if (data) { // ✅ verifica se não é null
            setNome(data.nome);
            setTelefone(data.telefone);
            setEndereco(data.endereco);
          } else {
            setError("Tutor não encontrado");
          }
        } catch (err) {
          console.error(err);
          setError("Erro ao carregar tutor");
        }
      };
      fetchTutor();
    }
  }, [tutorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Cria FormData para enviar arquivo corretamente
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("telefone", telefone);
      formData.append("endereco", endereco);
      if (foto) formData.append("foto", foto);

      if (tutorId) {
        await updateTutor(tutorId, formData);
      } else {
        await createTutor(formData);
      }

      if (onSuccess) onSuccess();

      // limpa formulário
      setNome("");
      setTelefone("");
      setEndereco("");
      setFoto(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar tutor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-4">
        {tutorId ? "Editar Tutor" : "Cadastrar Novo Tutor"}
      </h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) setFoto(e.target.files[0]);
          }}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className={`bg-blue-500 text-white py-2 rounded font-semibold ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
