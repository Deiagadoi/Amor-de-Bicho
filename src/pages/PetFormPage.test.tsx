import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { PetFormPage } from "./PetFormPage";
import * as petService from "../services/petsService";

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

describe("PetFormPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = (initialRoute = "/pets/novo") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/pets/novo" element={<PetFormPage />} />
          <Route path="/pets/:id/editar" element={<PetFormPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("deve renderizar o formulário corretamente", () => {
    setup();

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/raça/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/idade/i)).toBeInTheDocument();
  });

  // 🔁 TESTE AJUSTADO AQUI
  it("deve impedir salvar com campos obrigatórios vazios (não chama create/update)", async () => {
    const createPetSpy = vi
      .spyOn(petService, "createPet")
      .mockResolvedValue({} as any);
    const updatePetSpy = vi
      .spyOn(petService, "updatePet")
      .mockResolvedValue({} as any);

    setup("/pets/novo");

    const btnSalvar = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(createPetSpy).not.toHaveBeenCalled();
      expect(updatePetSpy).not.toHaveBeenCalled();
    });
  });

  it("deve criar um novo pet ao salvar sem ID", async () => {
    const createPetSpy = vi
      .spyOn(petService, "createPet")
      .mockResolvedValue({ id: 1 } as any);
    vi.spyOn(petService, "uploadPetPhoto").mockResolvedValue({} as any);
    vi.spyOn(petService, "getPetById").mockResolvedValue({} as any);

    setup("/pets/novo");

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Rex" },
    });
    fireEvent.change(screen.getByLabelText(/raça/i), {
      target: { value: "SRD" },
    });
    fireEvent.change(screen.getByLabelText(/idade/i), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(createPetSpy).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/pets");
    });
  });

  it("deve atualizar um pet ao salvar com ID (modo edição)", async () => {
    vi.spyOn(petService, "getPetById").mockResolvedValue({
      id: 10,
      nome: "Thor",
      idade: 4,
      raca: "Labrador",
    } as any);

    const updatePetSpy = vi
      .spyOn(petService, "updatePet")
      .mockResolvedValue({} as any);
    vi.spyOn(petService, "uploadPetPhoto").mockResolvedValue({} as any);

    setup("/pets/10/editar");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Thor")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Thor Atualizado" },
    });

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(updatePetSpy).toHaveBeenCalledWith(10, {
        nome: "Thor Atualizado",
        idade: 4,
        raca: "Labrador",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/pets");
    });
  });
});
