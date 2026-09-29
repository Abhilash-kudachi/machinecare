import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Maintenance from "@/models/Maintenance";
import Machine from "@/models/Machine";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { maintenanceSchema } from "@/validations/maintenance";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid maintenance ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const maintenance =
      await Maintenance.findById(id)
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
        .lean();

    if (!maintenance) {
      return NextResponse.json(
        {
          success: false,
          message: "Maintenance record not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      maintenance,
    });
  } catch (error) {
    console.error(
      "Get maintenance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch maintenance record",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid maintenance ID",
        },
        { status: 400 }
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

    const maintenance =
      await Maintenance.findByIdAndUpdate(
        id,
        {
          ...data,
          startedAt:
            data.startedAt || undefined,
          completedAt:
            data.completedAt || undefined,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!maintenance) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Maintenance record not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Maintenance record updated successfully",
      maintenance,
    });
  } catch (error) {
    console.error(
      "Update maintenance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update maintenance record",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only administrators can delete maintenance records",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid maintenance ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const maintenance =
      await Maintenance.findByIdAndDelete(id);

    if (!maintenance) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Maintenance record not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Maintenance record deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete maintenance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete maintenance record",
      },
      { status: 500 }
    );
  }
}