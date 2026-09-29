import { z } from "zod";

export const maintenanceSchema = z.object({
  machine: z
    .string()
    .min(1, "Machine is required"),

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(1000),

  maintenanceType: z.enum([
    "PREVENTIVE",
    "CORRECTIVE",
    "EMERGENCY",
    "INSPECTION",
  ]),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ]),

  status: z.enum([
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),

  technician: z
    .string()
    .min(1, "Technician is required"),

  scheduledDate: z.coerce.date(),

  startedAt: z
    .union([
      z.coerce.date(),
      z.literal(""),
    ])
    .optional(),

  completedAt: z
    .union([
      z.coerce.date(),
      z.literal(""),
    ])
    .optional(),

  diagnosis: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),

  actionTaken: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),

  partsUsed: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  downtimeHours: z
    .coerce
    .number()
    .min(0, "Downtime cannot be negative")
    .optional()
    .default(0),

  cost: z
    .coerce
    .number()
    .min(0, "Cost cannot be negative")
    .optional()
    .default(0),

  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),
});

export type MaintenanceInput = z.infer<
  typeof maintenanceSchema
>;