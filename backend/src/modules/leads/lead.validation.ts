import { z } from "zod";

export const createLeadSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(6, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.enum(["WEBSITE", "ADS", "CALL", "REFERRAL", "MANUAL"]).optional(),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  preferences: z.string().optional(),
  notes: z.string().optional(),
  assignedAgentId: z.string().optional(),
  followUpAt: z.string().datetime().optional(),
});

export const updateLeadSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.enum(["WEBSITE", "ADS", "CALL", "REFERRAL", "MANUAL"]).optional(),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  preferences: z.string().optional(),
  notes: z.string().optional(),
  assignedAgentId: z.string().optional(),
  followUpAt: z.string().datetime().optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "LOST"]),
});

export const assignLeadSchema = z.object({
  assignedAgentId: z.string().min(1, "Agent id is required"),
});