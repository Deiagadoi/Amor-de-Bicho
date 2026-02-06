// src/pages/__tests__/TutorsPage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { TutorsPage } from "../TutorsPage";
import * as tutorsService from "../../services/tutorsService";

describe("TutorsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <TutorsPage />
      </MemoryRouter>
    );

  const tutorAna = {
    id: 1,
    nome: "Ana Silva",
    telefone: "(65) 99999-0000",
    endereco: "Rua A, 123",
    foto: null,
    pets: [],
  } as any;

  const tutorBruno = {
    id: 2,
    nome: "Bruno Souza",
    telefone: "(65) 98888-1111",
    endereco: "Rua B, 456",
    foto: null,
    pets: [],
  } as any;

  it("deve listar tutores após carregar a API", async () => {
    const getTutorsSpy = vi
      .spyOn(tutorsService, "getTutors")
      .mockResolvedValue([tutorAna, tutorBruno]);

    renderPage();

    await waitFor(() => {
      expect(getTutorsSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Ana Silva")).toBeInTheDocument();
      expect(screen.getByText("Bruno Souza")).toBeInTheDocument();
    });
  });

  it("deve filtrar tutores pelo nome digitado na busca", async () => {
    vi.spyOn(tutorsService, "getTutors").mockResolvedValue([
      tutorAna,
      tutorBruno,
    ]);

    renderPage();

    // aguarda carregar a lista
    await waitFor(() => {
      expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    });

    const inputBusca = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(inputBusca, { target: { value: "Ana" } });

    await waitFor(() => {
      expect(screen.getByText("Ana Silva")).toBeInTheDocument();
      expect(screen.queryByText("Bruno Souza")).not.toBeInTheDocument();
    });
  });

  it("deve excluir tutor ao confirmar e removê-lo da tela", async () => {
    vi.spyOn(tutorsService, "getTutors").mockResolvedValue([tutorAna]);

    const deleteTutorSpy = vi
      .spyOn(tutorsService, "deleteTutor")
      .mockResolvedValue(undefined as any);

    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockImplementation(() => true);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    });

    // botão de lixeira usa title="Excluir" no TutorsPage
    const btnExcluir = screen.getByTitle(/excluir/i);
    fireEvent.click(btnExcluir);

    await waitFor(() => {
      expect(deleteTutorSpy).toHaveBeenCalledWith(1);
      expect(screen.queryByText("Ana Silva")).not.toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});
