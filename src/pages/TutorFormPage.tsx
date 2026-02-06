import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getTutorById,
  createTutor,
  updateTutor,
} from "../services/tutorsService";

// Máscara de telefone: (65) 99999-9999 ou (65) 9999-9999
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14);
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

export const TutorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // se existir = edição

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    endereco: "",
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoAtualUrl, setFotoAtualUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carrega dados do tutor se for edição
  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        const tutor = await getTutorById(Number(id));
        if (tutor) {
          setForm({
            nome: tutor.nome,
            telefone: tutor.telefone || "",
            endereco: tutor.endereco || "",
          });

          // tenta pegar a URL da foto atual de forma flexível
          const anyTutor = tutor as any;
          const url =
            anyTutor.fotoUrl || anyTutor.foto?.url || null;

          if (url) {
            setFotoAtualUrl(url);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar tutor:", err);
        alert("Erro ao carregar dados do tutor.");
      }
    };

    void load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      setForm((prev) => ({ ...prev, telefone: formatPhone(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !form.nome.trim() ||
        !form.telefone.trim() ||
        !form.endereco.trim()
      ) {
        alert("Nome, telefone e endereço são obrigatórios.");
        setLoading(false);
        return;
      }

      // monta FormData para enviar dados + foto em uma requisição
      const formData = new FormData();
      formData.append("nome", form.nome.trim());
      formData.append("telefone", form.telefone.trim());
      formData.append("endereco", form.endereco.trim());
      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      let tutorId: number;

      if (!id) {
        // Criar
        const created = await createTutor(formData);
        tutorId = created.id;
      } else {
        // Atualizar
        const updated = await updateTutor(Number(id), formData);
        tutorId = updated.id;
      }

      console.log("Tutor salvo com ID:", tutorId);

      alert("Tutor salvo com sucesso!");
      navigate("/tutores");
    } catch (error) {
      console.error("Erro ao salvar tutor:", error);
      alert("Erro ao salvar tutor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
      {/* Botão Voltar */}
      <Link
        to="/tutores"
        className="text-sky-600 hover:text-sky-800 text-sm font-semibold inline-flex items-center mb-4"
      >
        ← Voltar para lista
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        {id ? "Editar Tutor" : "Cadastrar Novo Tutor"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block mb-1 font-medium">
            Nome completo
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

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block mb-1 font-medium">
            Telefone
          </label>
          <input
            id="telefone"
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        {/* Endereço */}
        <div>
          <label htmlFor="endereco" className="block mb-1 font-medium">
            Endereço
          </label>
          <input
            id="endereco"
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        {/* Foto */}
        <div>
          <label className="block mb-1 font-medium">Foto (opcional)</label>
          <input
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

          {!fotoFile && fotoAtualUrl && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1">Foto atual:</p>
              <img
                src={fotoAtualUrl}
                alt={form.nome}
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
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
