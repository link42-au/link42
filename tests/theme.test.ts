import { describe, expect, it } from "vitest";
import { oppositeTheme } from "$lib/theme";

describe("theme helpers", () => {
  it("switches between the only two supported themes", () => {
    expect(oppositeTheme("light")).toBe("dark");
    expect(oppositeTheme("dark")).toBe("light");
  });
});
