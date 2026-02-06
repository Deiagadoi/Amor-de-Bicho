import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  PawPrint,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getTutors, deleteTutor } from "../services/tutorsService";
import type { Tutor } from "../services/tutorsService";

/* ================================
   CONFIG
================================ */
const ITEMS_PER_PAGE = 8;

/* ================================
   COMPONENT
================================ */
export const TutorsPage: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // página exibida (1-based)
  const [totalPages, setTotalPages] = useState(1);

  /* ================================
     LOAD
  ================================ */
  async function loadTutors() {
    try {
      setLoading(true);

      // API é 0-based, então mandamos page - 1
      const data = await getTutors(page - 1, ITEMS_PER_PAGE, search);

      // getTutors retorna PagedTutors => usamos content
      setTutors(data.content);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error("Erro ao carregar tutores:", err);
      alert("Erro ao carregar tutores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTutors();
  }, [page, search]);

  /* Quando o usuário digita na busca, sempre volta para a página 1 */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  /* ================================
     DELETE
  ================================ */
  async function handleDelete(tutor: Tutor) {
    if (!confirm(`Excluir tutor "${tutor.nome}"?`)) return;

    try {
      await deleteTutor(tutor.id);
      setTutors((prev) => prev.filter((t) => t.id !== tutor.id));
      alert("Tutor excluído!");
    } catch {
      alert("Erro ao excluir tutor.");
    }
  }

  /* ================================
     UI
  ================================ */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tutores</h1>
          <p className="text-sm text-slate-500">
            Gerencie tutores e seus pets vinculados
          </p>
        </div>

        <Link
          to="/tutores/novo"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Plus size={18} />
          Novo Tutor
        </Link>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-2 max-w-md">
        <Search size={18} className="text-slate-400" />
        <input
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por nome..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-200 rounded-lg" />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && tutors.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          Nenhum tutor encontrado.
        </div>
      )}

      {/* TABLE */}
      {!loading && tutors.length > 0 && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Telefone</th>
                <th className="px-4 py-3 text-left">Endereço</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {tutors.map((tutor) => (
                <tr
                  key={tutor.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-4 py-3">{tutor.nome}</td>
                  <td className="px-4 py-3">{tutor.telefone || "-"}</td>
                  <td className="px-4 py-3">{tutor.endereco || "-"}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/tutores/${tutor.id}/editar`}
                        className="text-sky-600 hover:text-sky-800"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </Link>

                      <Link
                        to={`/tutores/${tutor.id}/pets`}
                        className="text-teal-600 hover:text-teal-800"
                        title="Pets"
                      >
                        <PawPrint size={18} />
                      </Link>

                      <button
                        onClick={() => void handleDelete(tutor)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-sm text-slate-500">
              Página {page} de {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
