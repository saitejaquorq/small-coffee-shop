import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    // Generated design screens carry `@ts-nocheck`: they are written under the
    // design phase's JS runtime contract, not as hand-written TypeScript. That
    // contract also uses `var` declarations, which the recommended JS rule set
    // flags but the generated code is not ours to rewrite.
    files: ["src/screens/**"],
    rules: { "@typescript-eslint/ban-ts-comment": "off", "no-var": "off" },
  },
);