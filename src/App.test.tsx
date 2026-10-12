// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithOtp: vi.fn(),
  verifyOtp: vi.fn(),
  signOut: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("./lib/supabase", () => ({
  supabaseConfigured: true,
  supabase: {
    auth: {
      getSession: mocks.getSession,
      onAuthStateChange: mocks.onAuthStateChange,
      signInWithOtp: mocks.signInWithOtp,
      verifyOtp: mocks.verifyOtp,
      signOut: mocks.signOut,
    },
    from: mocks.from,
    rpc: mocks.rpc,
  },
  deliveryStatusLabels: { pending: "Pendente", in_transit: "Em trânsito", delivered: "Entregue", delayed: "Atrasada" },
}));

import App from "./App";

describe("Controle de Entregas authentication flow", () => {
  afterEach(() => { cleanup(); vi.clearAllMocks(); });

  it("requires an email before requesting an OTP", async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    render(<App />);
    await screen.findByRole("heading", { name: "Controle de Entregas" });
    const sendButton = screen.getByRole("button", { name: "Enviar código" });
    fireEvent.click(sendButton);
    expect(mocks.signInWithOtp).not.toHaveBeenCalled();
  });

  it("requests a one-time code for the entered email and reports the result", async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    mocks.signInWithOtp.mockResolvedValue({ error: null });
    render(<App />);
    await screen.findByRole("heading", { name: "Controle de Entregas" });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "operador@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar código" }));
    await waitFor(() => expect(mocks.signInWithOtp).toHaveBeenCalledWith({
      email: "operador@example.com",
      options: { shouldCreateUser: true },
    }));
    expect((await screen.findByRole("status")).textContent).toContain("Enviamos um código para seu e-mail");
  });

  it("submits the one-time code for verification instead of treating the UI as authenticated", async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    mocks.verifyOtp.mockResolvedValue({ error: null });
    render(<App />);
    await screen.findByRole("heading", { name: "Controle de Entregas" });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "operador@example.com" } });
    fireEvent.change(screen.getByLabelText("Código recebido"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar código" }));
    await waitFor(() => expect(mocks.verifyOtp).toHaveBeenCalledWith({
      email: "operador@example.com",
      token: "123456",
      type: "email",
    }));
  });
});
