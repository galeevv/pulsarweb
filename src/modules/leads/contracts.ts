import { z } from "zod"
import { leadServiceSchema } from "./domain/schema"

// Delivery contracts are shared with the browser, but are not domain entities.
export const leadApiResponseSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), leadId: z.string().min(1) }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string().min(1),
      message: z.string().min(1),
      fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
    }),
    requestId: z.string().min(1),
  }),
])

export const contactQuerySchema = z.object({
  service: leadServiceSchema.optional().catch(undefined),
})

export type LeadApiResponse = z.infer<typeof leadApiResponseSchema>
