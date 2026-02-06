import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { PetsPage } from "../PetsPage";
import * as petsService from "../../services/petsService";

// Mock de navegação (useNavigate)
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("PetsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <PetsPage />
      </MemoryRouter>
    );

  const petRex = {
    id: 1,
    nome: "Rex",
    raca: "SRD",
    idade: 5,
    foto: null,
  } as any;

  const petMia = {
    id: 2,
    nome: "Mia",
    raca: "Poodle",
    idade: 3,
    foto: null,
  } as any;

  it("deve listar pets em cards após carregar da API", async () => {
    const getPetsSpy = vi
      .spyOn(petsService, "getPets")
      .mockResolvedValue({
        content: [petRex],
        totalPages: 1,
      } as any);

    renderPage();

    await waitFor(() => {
      expect(getPetsSpy).toHaveBeenCalledWith(0, "");
      expect(screen.getByText("Rex")).toBeInTheDocument();
      expect(screen.getByText(/raça \/ espécie:/i)).toBeInTheDocument();

      // ✅ matcher mais flexível para o texto da idade
      expect(
        screen.getByText((text) =>
          text.toLowerCase().includes("idade") &&
          text.toLowerCase().includes("5")
        )
      ).toBeInTheDocument();
    });
  });

  it("deve navegar para cadastro de novo pet ao clicar em '+ Novo Pet'", async () => {
    vi.spyOn(petsService, "getPets").mockResolvedValue({
      content: [petRex],
      totalPages: 1,
    } as any);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Rex")).toBeInTheDocument();
    });

    const btnNovo = screen.getByRole("button", { name: /\+ novo pet/i });
    fireEvent.click(btnNovo);

    expect(mockNavigate).toHaveBeenCalledWith("/pets/novo");
  });

  it("deve navegar para detalhes ao clicar no card do pet", async () => {
    vi.spyOn(petsService, "getPets").mockResolvedValue({
      content: [petRex],
      totalPages: 1,
    } as any);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Rex")).toBeInTheDocument();
    });

    // O card é o container que contém o texto "Rex"
    const card = screen.getByText("Rex").closest("div");
    expect(card).not.toBeNull();

    if (card) {
      fireEvent.click(card);
    }

    expect(mockNavigate).toHaveBeenCalledWith("/pets/1");
  });

  it("deve excluir pet ao confirmar e removê-lo da tela", async () => {
    vi.spyOn(petsService, "getPets").mockResolvedValue({
      content: [petRex],
      totalPages: 1,
    } as any);

    const deletePetSpy = vi
      .spyOn(petsService, "deletePet")
      .mockResolvedValue(undefined as any);

    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockImplementation(() => true);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Rex")).toBeInTheDocument();
    });

    const btnExcluir = screen.getByRole("button", { name: /excluir/i });
    fireEvent.click(btnExcluir);

    await waitFor(() => {
      expect(deletePetSpy).toHaveBeenCalledWith(1);
      expect(screen.queryByText("Rex")).not.toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });

  it("deve paginar ao clicar em 'Próxima'", async () => {
    const getPetsSpy = vi
      .spyOn(petsService, "getPets")
      .mockResolvedValueOnce({
        content: [petRex],
        totalPages: 2,
      } as any)
      .mockResolvedValueOnce({
        content: [petMia],
        totalPages: 2,
      } as any);

    renderPage();

    // primeira página (Rex)
    await waitFor(() => {
      expect(screen.getByText("Rex")).toBeInTheDocument();
    });

    const btnProxima = screen.getByRole("button", { name: /próxima/i });
    fireEvent.click(btnProxima);

    await waitFor(() => {
      expect(getPetsSpy).toHaveBeenLastCalledWith(1, "");
      expect(screen.getByText("Mia")).toBeInTheDocument();
    });
  });
});
