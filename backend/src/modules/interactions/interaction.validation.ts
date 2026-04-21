import { z } from "zod";

export const createInteractionSchema = z.object({
  clientId: z.string().optional(),
  leadId: z.string().optional(),
  type: z.enum(["CALL", "SMS", "EMAIL", "VISIT", "NOTE"]),
  summary: z.string().min(2, "Summary is required"),
  happenedAt: z.string().datetime().optional(),
});