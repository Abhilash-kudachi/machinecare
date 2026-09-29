import { z } from "zod";

export const machineSchema = z.object({
  machineName: z
    .string()
    .trim()
    .min(2, "Machine name must be at least 2 characters")
    .max(150, "Machine name must not exceed 150 characters"),

  machineCode: z
    .string()
    .trim()
    .min(2, "Machine code is required")
    .max(50, "Machine code must not exceed 50 characters")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Machine code can contain only letters, numbers and hyphens"
    ),

  manufacturer: z
    .string()
    .trim()
    .min(2, "Manufacturer is required")
    .max(100, "Manufacturer must not exceed 100 characters"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .max(100, "Model must not exceed 100 characters"),

  machineType: z
    .string()
    .trim()
    .min(2, "Machine type is required")
    .max(100, "Machine type must not exceed 100 characters"),

  location: z
    .string()
    .trim()
    .min(2, "Location is required")
    .max(200, "Location must not exceed 200 characters"),

  installationDate: z.coerce.date(),

  status: z.enum([
    "OPERATIONAL",
    "MAINTENANCE",
    "CRITICAL",
    "INACTIVE",
  ]),

  lastMaintenanceDate: z
    .union([
      z.coerce.date(),
      z.literal(""),
    ])
    .optional(),

  nextMaintenanceDate: z
    .union([
      z.coerce.date(),
      z.literal(""),
    ])
    .optional(),
});

export type MachineInput = z.infer<typeof machineSchema>;