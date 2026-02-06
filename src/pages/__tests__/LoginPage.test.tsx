
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// mock do useAuth
const mockLogin = vi.fn();
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: false,
  }),
}));

// mock do react-router-dom (apenas o que o LoginPage usa)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: undefined }),
  };
});

import { LoginPage } from "../LoginPage";

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  it("deve chamar login com usuário e senha informados", async () => {
    render(<LoginPage />);

    const userInput = screen.getByLabelText(/usuário/i);
    const passInput = screen.getByLabelText(/senha/i);
    const button = screen.getByRole("button", { name: /entrar/i });

    fireEvent.change(userInput, { target: { value: "admin" } });
    fireEvent.change(passInput, { target: { value: "admin" } });

    fireEvent.click(button);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith("admin", "admin");
  });
});
