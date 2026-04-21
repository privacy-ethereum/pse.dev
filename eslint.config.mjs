import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"
import tailwindcssPlugin from "eslint-plugin-tailwindcss"
import globals from "globals"
import tseslint from "typescript-eslint"
import { nextEslintPlugin } from "./next.eslint.config.mjs"

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: ["dist/*", ".cache", "public", "node_modules", "*.esm.js", ".next/*"] },
  { languageOptions: { globals: globals.browser } },
  // Node.js config files
  {
    files: ["*.config.js", "*.config.mjs", "*.config.cjs"],
    languageOptions: { globals: globals.node }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-key": "off",
    },
  },
  nextEslintPlugin,
  {
    plugins: {
      tailwindcss: tailwindcssPlugin,
    },
    settings: {
      tailwindcss: {
        callees: ["cn"],
        config: "tailwind.config.js"
      },
      next: {
        rootDir: ["./"]
      }
    },
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "quotes": ["error", "double"],
    },
  },
]
