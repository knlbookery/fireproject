import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // `archive/` holds intentionally-dead legacy code (the pre-migration
  // TanStack Start SSR app and its API routes), kept only as a rollback
  // reference — see archive/*/README.md. It is never built, imported, or
  // deployed, so linting it produces noise about code we deliberately do
  // not maintain.
  { ignores: ["dist", ".output", ".vinxi", "archive"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // shadcn/ui components are generated to a fixed convention that exports a
  // component alongside its variant helper (Button + buttonVariants, etc.).
  // react-refresh/only-export-components flags that pattern, but it only
  // affects hot-reload granularity in dev — there is no production impact,
  // and splitting every such file would mean hand-editing generated
  // components we otherwise leave untouched.
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  eslintPluginPrettier,
);
