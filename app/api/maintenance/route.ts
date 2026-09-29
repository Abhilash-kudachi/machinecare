import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Maintenance from "@/models/Maintenance";
import Machine from "@/models/Machine";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { maintenanceSchema } from "@/validations/maintenance";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    const status =
      searchParams.get("status") || "";

    const priority =
      searchParams.get("priority") || "";

    const machine =
      searchParams.get("machine") || "";

    const filter: Record<string, unknown> = {};

    if (
      status &&
      [
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ].includes(status)
    ) {
      filter.status = status;
    }

    if (
      priority &&
      ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(
        priority
      )
    ) {
      filter.priority = priority;
    }

    if (
      machine &&
      mongoose.Types.ObjectId.isValid(machine)
    ) {
      filter.machine = machine;
    }

    const records = await Maintenance.find(filter)
      .populate(
        "machine",
        "machineName machineCode manufacturer model"
      )
      .populate(
        "technician",
        "name email role"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .sort({
        scheduledDate: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      maintenance: records,
    });
  } catch (error) {
    console.error(
      "Get maintenance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch maintenance records",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result =
      maintenanceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors:
            result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;

    if (
      !mongoose.Types.ObjectId.isValid(data.machine)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid machine ID",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        data.technician
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid technician ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const machine = await Machine.findById(
      data.machine
    );

    if (!machine) {
      return NextResponse.json(
        {
          success: false,
          message: "Machine not found",
        },
        { status: 404 }
      );
    }

    const technician = await User.findById(
      data.technician
    );

    if (!technician) {
      return NextResponse.json(
        {
          success: false,
          message: "Technician not found",
        },
        { status: 404 }
      );
    }

    if (
      !["ADMIN", "MANAGER", "TECHNICIAN"].includes(
        technician.role
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected user cannot be assigned as technician",
        },
        { status: 400 }
      );
    }

    const maintenance =
      await Maintenance.create({
        ...data,
        startedAt:
          data.startedAt || undefined,
        completedAt:
          data.completedAt || undefined,
        createdBy: user.userId,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Maintenance record created successfully",
        maintenance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create maintenance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create maintenance record",
      },
      { status: 500 }
    );
  }
}