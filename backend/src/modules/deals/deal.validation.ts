import { z } from "zod";

export const createDealSchema = z.object({
  title: z.string().min(2, "Title is required"),
  clientId: z.string().min(1, "Client id is required"),
  propertyId: z.string().min(1, "Property id is required"),
  agentId: z.string().min(1, "Agent id is required"),
  stage: z.enum(["NEGOTIATION", "AGREEMENT", "CLOSED"]).optional(),
  dealValue: z.number().positive("Deal value must be greater than 0"),
  commissionPercent: z.number().min(0).max(100),
  expectedCloseDate: z.string().datetime().optional(),
  closedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const updateDealSchema = z.object({
  title: z.string().min(2).optional(),
  clientId: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  stage: z.enum(["NEGOTIATION", "AGREEMENT", "CLOSED"]).optional(),
  dealValue: z.number().positive().optional(),
  commissionPercent: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().datetime().optional(),
  closedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const updateDealStageSchema = z.object({
  stage: z.enum(["NEGOTIATION", "AGREEMENT", "CLOSED"]),
});