import { describe, expect, it } from "vitest";
import App from "./App";

describe("App Delivery Management", () => {
  it("deve carregar o componente principal", () => {
    expect(App).toBeTypeOf("function");
  });
});
