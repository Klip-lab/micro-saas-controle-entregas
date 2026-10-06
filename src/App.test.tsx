import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renderiza o controle de entregas e campos de cadastro", () => {
    render(<App />);
    expect(screen.getByText(/Controle de Entregas/i)).toBeDefined();
    expect(screen.getByText(/Cadastrar Nova Entrega/i)).toBeDefined();
    expect(screen.getByText(/Visão de Acompanhamento/i)).toBeDefined();
  });
});
