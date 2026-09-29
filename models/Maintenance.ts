import mongoose, { Schema, Document, Model } from "mongoose";

export type MaintenanceType =
  | "PREVENTIVE"
  | "CORRECTIVE"
  | "EMERGENCY"
  | "INSPECTION";

export type MaintenancePriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type MaintenanceStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface IMaintenance extends Document {
  machine: mongoose.Types.ObjectId;

  title: string;

  description: string;

  maintenanceType: MaintenanceType;

  priority: MaintenancePriority;

  status: MaintenanceStatus;

  technician: mongoose.Types.ObjectId;

  scheduledDate: Date;

  startedAt?: Date;

  completedAt?: Date;

  diagnosis?: string;

  actionTaken?: string;

  partsUsed?: string[];

  downtimeHours?: number;

  cost?: number;

  notes?: string;

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const MaintenanceSchema = new Schema<IMaintenance>(
  {
    machine: {
      type: Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    maintenanceType: {
      type: String,
      enum: [
        "PREVENTIVE",
        "CORRECTIVE",
        "EMERGENCY",
        "INSPECTION",
      ],
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
      ],
      required: true,
      default: "MEDIUM",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      required: true,
      default: "SCHEDULED",
      index: true,
    },

    technician: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    diagnosis: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    actionTaken: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    partsUsed: {
      type: [String],
      default: [],
    },

    downtimeHours: {
      type: Number,
      min: 0,
      default: 0,
    },

    cost: {
      type: Number,
      min: 0,
      default: 0,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MaintenanceSchema.index({
  machine: 1,
  status: 1,
});

MaintenanceSchema.index({
  priority: 1,
  scheduledDate: 1,
});

const Maintenance: Model<IMaintenance> =
  mongoose.models.Maintenance ||
  mongoose.model<IMaintenance>(
    "Maintenance",
    MaintenanceSchema
  );

export default Maintenance;