import path from "node:path"
import { z } from "zod"

export const databaseUrlSchema = z
  .string()
  .startsWith("file:")
  .refine((value) => {
    const file = value.slice(5).replaceAll("\\", "/")
    return (
      file.trim().length > 0 &&
      file !== ":memory:" &&
      !file.startsWith("//") &&
      !file.includes("\0") &&
      !/[?#%]/.test(file)
    )
  }, "Use file:<filesystem path>, without URI encoding, query or fragment")
  .default("file:./prisma/pulsarweb.db")

// Prisma CLI and the driver must resolve relative paths from the same directory.
export function resolveDatabaseUrl(value?: string): string {
  const url = databaseUrlSchema.parse(value)
  // Runtime SQLite data is provisioned separately; it must not be traced into the build.
  const file = path
    .resolve(/* turbopackIgnore: true */ process.cwd(), url.slice(5))
    .replaceAll("\\", "/")
  return `file:${file}`
}
