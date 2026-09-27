import { describe, expect, it } from "vitest";
import { LIMITS, normalizeContact, validateContact } from "@backend/contracts/schema";

const valid = {
  name: "Ana Pérez",
  email: "ana@company.com",
  company: "Example Industrial",
  interest: "assessment",
  message: "We won a contract in Colombia and need to plan the entry.",
};

describe("normalizeContact", () => {
  it("trims, collapses whitespace in single-line fields and lowercases email", () => {
    const fields = normalizeContact({ ...valid, name: "  Ana \n  Pérez ", email: " ANA@Company.com " });
    expect(fields.name).toBe("Ana Pérez");
    expect(fields.email).toBe("ana@company.com");
  });

  it("strips control characters but keeps line breaks in the message", () => {
    const fields = normalizeContact({ ...valid, message: "Line one\u0000\r\nLine two\u0007" });
    expect(fields.message).toBe("Line one\nLine two");
  });

  it("keeps a supported locale and falls back to English otherwise", () => {
    expect(normalizeContact({ ...valid, locale: "es" }).locale).toBe("es");
    expect(normalizeContact({ ...valid, locale: "fr" }).locale).toBe("en");
  });

  it("falls back to the general interest for unknown values", () => {
    expect(normalizeContact({ ...valid, interest: "hack" }).interest).toBe("expansion");
    expect(normalizeContact({ ...valid, interest: "__proto__" }).interest).toBe("expansion");
  });

  it("treats non-string values (e.g. File entries) as empty", () => {
    expect(normalizeContact({ ...valid, name: new Blob(["x"]) }).name).toBe("");
  });
});

describe("validateContact", () => {
  it("accepts a complete inquiry", () => {
    expect(validateContact(normalizeContact(valid))).toEqual({});
  });

  it("requires every field", () => {
    expect(validateContact(normalizeContact({}))).toEqual({
      name: "required",
      email: "required",
      company: "required",
      message: "required",
    });
  });

  it("rejects malformed email addresses", () => {
    for (const email of ["ana", "ana@", "ana@company", "ana @company.com", "<a>@b.co"]) {
      expect(validateContact(normalizeContact({ ...valid, email })).email, email).toBe("invalid");
    }
  });

  it("enforces length limits", () => {
    const long = normalizeContact({
      ...valid,
      name: "a".repeat(LIMITS.name + 1),
      company: "c".repeat(LIMITS.company + 1),
      message: "m".repeat(LIMITS.messageMax + 1),
    });
    expect(validateContact(long)).toEqual({ name: "tooLong", company: "tooLong", message: "tooLong" });
    expect(validateContact(normalizeContact({ ...valid, message: "Too short" })).message).toBe("tooShort");
  });
});
