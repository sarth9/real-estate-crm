import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL"]),
  description: z.string().optional(),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().positive("Price must be greater than 0"),
  sizeSqft: z.number().positive().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  amenities: z.string().optional(),
  availabilityStatus: z
    .enum(["AVAILABLE", "BOOKED", "SOLD", "RENTED"])
    .optional(),
  listedByAgentId: z.string().optional(),
});

export const updatePropertySchema = z.object({
  title: z.string().min(2).optional(),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL"]).optional(),
  description: z.string().optional(),
  address: z.string().min(3).optional(),
  city: z.string().min(2).optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().positive().optional(),
  sizeSqft: z.number().positive().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  amenities: z.string().optional(),
  availabilityStatus: z
    .enum(["AVAILABLE", "BOOKED", "SOLD", "RENTED"])
    .optional(),
  listedByAgentId: z.string().optional(),
});

export const propertyQuerySchema = z.object({
  city: z.string().optional(),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL"]).optional(),
  availabilityStatus: z
    .enum(["AVAILABLE", "BOOKED", "SOLD", "RENTED"])
    .optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().optional(),
});