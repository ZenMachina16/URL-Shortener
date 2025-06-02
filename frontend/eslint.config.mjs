import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Ignore generated files
      "src/generated/**",
      ".next/**",
      "node_modules/**",
      "build/**",
      "dist/**",
    ],
    rules: {
      // Relax rules that cause issues in production builds
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn", 
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
];

export default eslintConfig;
