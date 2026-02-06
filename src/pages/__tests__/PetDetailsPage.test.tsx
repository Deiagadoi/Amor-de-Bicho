import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { PetDetailsPage } from "../PetDetailsPage";
import * as petsService from "../../services/petsService";
import * as tutorsService from "../../services/tutorsService";

describe("PetDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRoute = (initialPath = "/pets/1") =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/pets/:id" element={<PetDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

  const petSemTutor = {
    id: 1,
    nome: "Rex",
    raca: "SRD",
    idade: 5,
    tutores: [],
  } as any;

  const petComTutor = {
    id: 1,
    nome: "Mia",
    raca: "Poodle",
    idade: 3,
    tutores: [{ id: 99 }],
  } as any;

  const tutorMock = {
    id: 99,
    nome: "João da Silva",
    telefone: "(65) 99999-9999",
    endereco: "Rua das Flores, 123",
  } as any;

  it("deve carregar e exibir detalhes do pet (sem tutor)", async () => {
    const getPetSpy = vi
      .spyOn(petsService, "getPetById")
      .mockResolvedValue(petSemTutor);

    const getTutorSpy = vi.spyOn(tutorsService, "getTutorById");

    renderWithRoute("/pets/1");

    await waitFor(() => {
      expect(getPetSpy).toHaveBeenCalledWith(1);
    });

    // Nome
    expect(
      screen.getByRole("heading", { name: /rex/i })
    ).toBeInTheDocument();

    // Raça / espécie
    expect(
      screen.getByText((t) => t.toLowerCase().includes("raça / espécie"))
    ).toBeInTheDocument();
    expect(screen.getByText(/srd/i)).toBeInTheDocument();

    // Idade — apenas verifica o label
    expect(screen.getByText(/idade:/i)).toBeInTheDocument();

    // Não deve chamar tutor
    expect(getTutorSpy).not.toHaveBeenCalled();
  });

  it("deve carregar tutor quando o pet possuir tutor vinculado", async () => {
    vi.spyOn(petsService, "getPetById").mockResolvedValue(petComTutor);

    const getTutorSpy = vi
      .spyOn(tutorsService, "getTutorById")
      .mockResolvedValue(tutorMock);

    renderWithRoute("/pets/1");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /mia/i })
      ).toBeInTheDocument();
    });

    expect(getTutorSpy).toHaveBeenCalledWith(99);

    expect(screen.getByText(/tutor/i)).toBeInTheDocument();
    expect(screen.getByText(/joão da silva/i)).toBeInTheDocument();
    expect(screen.getByText(/\(65\) 99999-9999/)).toBeInTheDocument();
    expect(screen.getByText(/rua das flores, 123/i)).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando o pet não for encontrado", async () => {
    vi.spyOn(petsService, "getPetById").mockRejectedValue(
      new Error("not found")
    );

    renderWithRoute("/pets/999");

    await waitFor(() => {
      expect(
        screen.getByText(/erro ao carregar detalhes do pet/i)
      ).toBeInTheDocument();
    });
  });
});
