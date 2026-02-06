
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// mocks dos services (não vamos chamar API de verdade)
vi.mock("../../services/tutorsService", () => ({
  getTutorById: vi.fn(),
  createTutor: vi.fn(),
  updateTutor: vi.fn(),
  uploadTutorPhoto: vi.fn(),
}));

// mock do react-router-dom: useNavigate e useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}), // sem id => modo "cadastrar"
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  };
});

import { TutorFormPage } from "../TutorFormPage";

describe("TutorFormPage", () => {
  it("deve aplicar máscara no campo telefone ao digitar", () => {
    render(<TutorFormPage />);

    const telInput = screen.getByLabelText(/telefone/i);

    // Digita só números
    fireEvent.change(telInput, { target: { name: "telefone", value: "(65)98765-4321" } });

    // Espera a máscara
    expect(telInput).toHaveValue("(65) 98765-4321");
  });
});
