import mongoose, { Document, Model, Schema } from "mongoose";

export type MachineStatus =
  | "OPERATIONAL"
  | "MAINTENANCE"
  | "CRITICAL"
  | "INACTIVE";

export interface IMachine extends Document {
  machineName: string;
  machineCode: string;
  manufacturer: string;
  model: string;
  machineType: string;
  location: string;
  installationDate: Date;
  status: MachineStatus;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MachineSchema = new Schema<IMachine>(
  {
    machineName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    machineCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    manufacturer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    machineType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    installationDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["OPERATIONAL", "MAINTENANCE", "CRITICAL", "INACTIVE"],
      default: "OPERATIONAL",
      index: true,
    },

    lastMaintenanceDate: {
      type: Date,
    },

    nextMaintenanceDate: {
      type: Date,
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

const Machine: Model<IMachine> =
  mongoose.models.Machine ||
  mongoose.model<IMachine>("Machine", MachineSchema);

export default Machine;