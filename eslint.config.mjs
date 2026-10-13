import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/modules/*/domain/**/*.ts",
      "src/modules/*/application/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next",
                "next/**",
                "react",
                "react-dom",
                "react-dom/**",
                "@prisma/**",
                "**/generated/prisma/**",
                "better-sqlite3",
                "**/infrastructure/**",
                "@/lib/db/**",
                "@/integrations/**",
                "@/components/**",
              ],
              message:
                "Domain/application must depend on ports, not delivery or infrastructure implementations.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@prisma/**",
                "**/generated/prisma/**",
                "better-sqlite3",
                "**/leads/infrastructure/**",
              ],
              message:
                "Use the lead module's public contracts or server composition root.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
    "test-results/**",
    "playwright-report/**",
  ]),
])

export default eslintConfig
