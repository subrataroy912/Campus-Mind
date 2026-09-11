import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ProfileDetails from "./components/ProfileDetails.jsx";
import { formatDisplayText } from "@/utils/textFormat.js";

describe("Student creator status and display rules", () => {
  it("never outputs 'STUDENT_CREATOR' string when formatting account types", () => {
    expect(formatDisplayText("STUDENT")).toBe("Student");
    expect(formatDisplayText("STUDENT_CREATOR")).toBe("Student");
    expect(formatDisplayText("STUDENT_CREATOR")).not.toContain("CREATOR");
  });

  it("renders 'Student' with a subtle creator indicator mark when student is upgraded", () => {
    const details = [
      {
        label: "Account type",
        value: "STUDENT",
        icon: "member",
        isCreator: true,
      },
    ];

    const html = renderToString(<ProfileDetails details={details} />);

    expect(html).toContain("Student");
    expect(html).toContain("Course Creator");
    expect(html).not.toContain("STUDENT_CREATOR");
    expect(html).not.toContain("Student Creator");
  });

  it("renders 'Student' without creator indicator mark when student has standard privileges", () => {
    const details = [
      {
        label: "Account type",
        value: "STUDENT",
        icon: "member",
        isCreator: false,
      },
    ];

    const html = renderToString(<ProfileDetails details={details} />);

    expect(html).toContain("Student");
    expect(html).not.toContain("Course Creator");
    expect(html).not.toContain("STUDENT_CREATOR");
  });

  it("renders 'Teacher' without creator indicator mark because teachers already have full privileges", () => {
    const details = [
      {
        label: "Account type",
        value: "TEACHER",
        icon: "member",
        isCreator: false,
      },
    ];

    const html = renderToString(<ProfileDetails details={details} />);

    expect(html).toContain("Teacher");
    expect(html).not.toContain("Course Creator");
    expect(html).not.toContain("STUDENT_CREATOR");
  });
});
