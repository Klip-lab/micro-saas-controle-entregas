import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import React from "";

describe("App", () => {
  it("renderiza o painel de controle de entregas", () => {
    render(<App />);
    expect(screen.getByText(/Controle de Entregas/i)).toBeDefined();
    expect(screen.getByText(/Cadastrar Nova Entrega/i)).toBeDefined();
    expect(screen.getByText(/Acompanhamento das Entregas/i)).toBeDefined();
  });
});
