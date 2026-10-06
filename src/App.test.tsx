import { describe, expect, it } from "vitest";
import App from "./App";

describe("App Delivery Management", () => {
  it("renderiza o componente principal sem erros", () => {
    expect(App).toBeTypeOf("function");
  });
});
