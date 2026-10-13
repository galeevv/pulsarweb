// This entry point is client-safe. Server dependencies live in ./server.ts.
export { createLeadSchema, leadServiceIds } from "./domain/schema"
export type { CreateLeadInput } from "./domain/schema"
export { leadApiResponseSchema, contactQuerySchema } from "./contracts"
export type { LeadApiResponse } from "./contracts"
export type { Lead, LeadNotification } from "./domain/ports"
