import { loadEnvConfig } from "@next/env"
import { defineConfig } from "prisma/config"
import { resolveDatabaseUrl } from "./src/lib/env/database-url"

// Match Next.js .env precedence; deployment sets NODE_ENV=production.
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production")

// Prisma's SQLite file creation fails with the host's RUST_LOG=warn setting.
// https://github.com/prisma/prisma/issues/29355 (also reproduced on 7.10.0).
process.env.RUST_LOG = "info"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: resolveDatabaseUrl(process.env.DATABASE_URL) },
})
