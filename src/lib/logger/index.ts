export interface Logger {
  info(event: string, context?: Record<string, string | number | boolean>): void
  warn(event: string, context?: Record<string, string | number | boolean>): void
  error(
    event: string,
    context?: Record<string, string | number | boolean>
  ): void
}

function write(level: "info" | "warn" | "error", event: string, context = {}) {
  console[level](
    JSON.stringify({ time: new Date().toISOString(), level, event, ...context })
  )
}

export const logger: Logger = {
  info: (event, context) => write("info", event, context),
  warn: (event, context) => write("warn", event, context),
  error: (event, context) => write("error", event, context),
}
