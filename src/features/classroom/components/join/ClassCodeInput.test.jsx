import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ClassCodeInput } from "./ClassCodeInput.jsx";

describe("ClassCodeInput", () => {
  it("renders 8 character input fields and the separator", () => {
    const html = renderToString(
      <ClassCodeInput value={["A", "B", "C", "D", "E", "F", "G", "H"]} />,
    );

    expect(html).toContain("–");
    expect(html).toContain('value="A"');
    expect(html).toContain('value="B"');
    expect(html).toContain('value="H"');
    expect(html).toContain('aria-label="Code character 1"');
    expect(html).toContain('aria-label="Code character 8"');
  });

  it("handles string value prop", () => {
    const html = renderToString(<ClassCodeInput value="CODE1234" />);

    expect(html).toContain('value="C"');
    expect(html).toContain('value="O"');
    expect(html).toContain('value="D"');
    expect(html).toContain('value="E"');
    expect(html).toContain('value="1"');
  });

  it("applies error styles when hasError is true", () => {
    const html = renderToString(<ClassCodeInput hasError={true} />);

    expect(html).toContain("border-destructive");
  });

  it("applies disabled attributes when disabled is true", () => {
    const html = renderToString(<ClassCodeInput disabled={true} />);

    expect(html).toContain("disabled");
    expect(html).toContain("cursor-not-allowed");
  });
});
