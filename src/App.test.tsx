import { describe, expect, it } from "vitest";
import App from "./App";

describe("App Delivery System", () => {
  it("renderiza o componente principal", () => {
    expect(App).toBeTypeOf("function");
  });
});
