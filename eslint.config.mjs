import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Seed scripts are exempt from component rules
    "src/scripts/**",
  ]),
  {
    // File length limits — enforced for all source files.
    // Soft limit: warn at 200 lines (split opportunity).
    // Hard limit: error at 300 lines (must split before merging).
    // Exceptions: test files, generated files, schema files, pure data files.
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "src/__tests__/**",
      // Pure data / asset files — no logic, just large arrays/objects
      "src/data/**",
      "src/design-system/ascii/**",
      "src/types/**",
    ],
    rules: {
      "max-lines": [
        "error",
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
]);

export default eslintConfig;
