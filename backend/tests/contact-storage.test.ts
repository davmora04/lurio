import { beforeEach, describe, expect, it, vi } from "vitest";
import { getContactStore } from "@backend/contact/storage";

const { sql, neon } = vi.hoisted(() => ({ sql: vi.fn(), neon: vi.fn() }));
vi.mock("@neondatabase/serverless", () => ({ neon }));

beforeEach(() => {
  vi.resetAllMocks();
  neon.mockReturnValue(sql);
});

describe("Neon contact storage", () => {
  it("does not initialize a connection without configuration", () => {
    expect(getContactStore(" ")).toBeNull();
    expect(neon).not.toHaveBeenCalled();
  });

  it("passes user input as SQL parameters, preserving quotes and multiline text", async () => {
    sql.mockResolvedValue([{ id: "saved-id" }]);
    const name = "Robert'); DROP TABLE contact_requests; --";
    const message = "First line\nSecond line with 'quotes'";
    const store = getContactStore("postgresql://user:pass@example.neon.tech/db?sslmode=require")!;
    expect(await store.save({ name, message, email: "a@example.com", company: "Example", interest: "assessment", locale: "es", submittedAt: "2026-09-27T12:00:00Z" }, false)).toBe("saved-id");
    const [template, ...values] = sql.mock.calls[0];
    expect(template.join("?")).not.toContain(name);
    expect(values).toEqual([name, "a@example.com", "Example", "assessment", message, "es", "2026-09-27T12:00:00Z", "not_configured"]);
    await store.markNotification("saved-id", "failed");
    expect(sql.mock.calls[1].slice(1)).toEqual(["failed", "saved-id"]);
  });

  it("rejects a save when no persisted identifier is returned", async () => {
    sql.mockResolvedValue([]);
    const store = getContactStore("postgresql://user:pass@example.neon.tech/db")!;
    await expect(store.save({ name: "Ana", email: "a@example.com", company: "Example", interest: "expansion", message: "Planning expansion", locale: "en", submittedAt: "2026-09-27T12:00:00Z" }, true)).rejects.toThrow();
  });
});
