import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza o produto", () => {
    expect(App).toBeTypeOf("function");
  });
});