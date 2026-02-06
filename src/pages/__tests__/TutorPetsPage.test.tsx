// src/pages/__tests__/TutorPetsPage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { TutorPetsPage } from "../TutorPetsPage";
import * as tutorsService from "../../services/tutorsService";
import * as petsService from "../../services/petsService";

describe("TutorPetsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // silencia qualquer alert() usado na tela
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  const renderWithRoute = (initialPath = "/tutores/10/pets") =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/tutores/:id/pets" element={<TutorPetsPage />} />
        </Routes>
      </MemoryRouter>
    );

  const tutorComPets = {
    id: 10,
    nome: "João Tutor",
    telefone: "(65) 99999-1111",
    endereco: "Rua das Flores, 123",
    pets: [
      { id: 1, nome: "Rex" },
      { id: 2, nome: "Mia" },
    ],
  } as any;

  const tutorSemPets = {
    id: 10,
    nome: "João Tutor",
    telefone: "(65) 99999-1111",
    endereco: "Rua das Flores, 123",
    pets: [],
  } as any;

  const petDisponivel = {
    id: 3,
    nome: "Thor",
    raca: "SRD",
    idade: 4,
  } as any;

  /* ============================================================
   * 1) Carregar dados do tutor e exibir pets vinculados
   * ========================================================== */
  it("deve carregar dados do tutor e exibir pets vinculados", async () => {
    vi.spyOn(tutorsService, "getTutorById").mockResolvedValue(tutorComPets);

    // evita chamada real para API de pets
    vi.spyOn(petsService, "getPets").mockResolvedValue({
      content: [],
      totalPages: 1,
    } as any);

    renderWithRoute("/tutores/10/pets");

    // Garante que a página carregou (título único)
    await screen.findByText(/gerenciar pets do tutor/i);

    // Nome do tutor aparece em algum lugar
    expect(screen.getAllByText(/joão tutor/i).length).toBeGreaterThan(0);

    // Pets vinculados
    expect(screen.getByText("Rex")).toBeInTheDocument();
    expect(screen.getByText("Mia")).toBeInTheDocument();
  });

  /* ============================================================
   * 2) Remover vínculo de um pet ao clicar em "Remover"
   * ========================================================== */
  it("deve remover vínculo de um pet ao clicar em 'Remover'", async () => {
    vi.spyOn(tutorsService, "getTutorById").mockResolvedValue(tutorComPets);

    // evita chamada real para API de pets
    vi.spyOn(petsService, "getPets").mockResolvedValue({
      content: [],
      totalPages: 1,
    } as any);

    const unlinkSpy = vi
      .spyOn(tutorsService, "unlinkPetFromTutor")
      .mockResolvedValue(undefined as any);

    // jsdom não implementa confirm, então mockamos
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    renderWithRoute("/tutores/10/pets");

    await screen.findByText("Rex");

    // no layout o texto do botão é "Remover vínculo"
    const btnRemover = screen.getAllByRole("button", {
      name: /remover vínculo/i,
    })[0];

    fireEvent.click(btnRemover);

    await waitFor(() => {
      expect(unlinkSpy).toHaveBeenCalledWith(10, 1);
    });

    confirmSpy.mockRestore();
  });

  /* ============================================================
   * 3) Vincular um novo pet ao tutor
   * ========================================================== */
  it("deve vincular um novo pet ao tutor", async () => {
    vi.spyOn(tutorsService, "getTutorById").mockResolvedValue(tutorSemPets);

    // lista de pets disponíveis para seleção
    vi.spyOn(petsService, "getPets").mockResolvedValue({
      content: [petDisponivel],
      totalPages: 1,
    } as any);

    const linkSpy = vi
      .spyOn(tutorsService, "linkPetToTutor")
      .mockResolvedValue(undefined as any);

    renderWithRoute("/tutores/10/pets");

    // pega diretamente o select (combobox) sem depender do label
    const select = await screen.findByRole("combobox");

    // garante que a option de Thor foi renderizada
    const optionThor = screen.getByRole("option", { name: /thor/i });
    expect(optionThor).toBeInTheDocument();

    // seleciona o pet de id 3
    fireEvent.change(select, { target: { value: "3" } });

    // botão de vincular (usa o texto completo do botão)
    const btnVincular = screen.getByRole("button", {
      name: /vincular pet ao tutor/i,
    });
    fireEvent.click(btnVincular);

    await waitFor(() => {
      expect(linkSpy).toHaveBeenCalledWith(10, 3);
    });
  });
});
