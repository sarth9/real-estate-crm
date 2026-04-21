import { z } from "zod";

export const createClientSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  clientType: z.enum(["BUYER", "SELLER", "INVESTOR", "TENANT"]),
  preferences: z.string().optional(),
  notes: z.string().optional(),
  linkedLeadId: z.string().optional(),
});

export const updateClientSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  clientType: z.enum(["BUYER", "SELLER", "INVESTOR", "TENANT"]).optional(),
  preferences: z.string().optional(),
  notes: z.string().optional(),
  linkedLeadId: z.string().optional(),
});