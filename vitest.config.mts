import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "frontend"),
      "@backend": path.resolve(import.meta.dirname, "backend"),
    },
  },
  test: {
    include: ["frontend/tests/**/*.test.ts", "backend/tests/**/*.test.ts"],
    environment: "node",
  },
});
