import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { settings: { next: { rootDir: "frontend/" } } },
  {
    files: ["frontend/**/*.{ts,tsx}"],
    ignores: ["frontend/app/actions.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@backend/contact", "@backend/contact/*", "**/backend/contact/**"],
          message: "Use the contact Server Action; only backend/contracts is browser-safe.",
        }],
      }],
    },
  },
  {
    files: ["backend/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/*", "**/frontend/**", "next", "next/*", "react", "react/*"],
          message: "Backend modules must remain independent of the frontend and Next.js.",
        }],
      }],
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    "**/.next/**",
    "out/**",
    "build/**",
    "**/next-env.d.ts",
    // Brand source packages (reference material, not application code):
    "02. MARCA/**",
  ]),
]);

export default eslintConfig;
