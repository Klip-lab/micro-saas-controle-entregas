import { describe, expect, it } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("is a valid component function", () => {
    expect(typeof App).toBe("function");
  });
});
