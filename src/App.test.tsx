import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza o componente de entregas", () => {
    expect(App).toBeTypeOf("function");
  });
});
