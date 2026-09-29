import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Machine from "@/models/Machine";
import { getCurrentUser } from "@/lib/auth";
import {
  canDeleteMachine,
  canUpdateMachine,
} from "@/lib/permissions";
import { machineSchema } from "@/validations/machine";

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
          message: "Invalid machine ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const machine = await Machine.findById(id)
      .populate("createdBy", "name email")
      .lean();

    if (!machine) {
      return NextResponse.json(
        {
          success: false,
          message: "Machine not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      machine,
    });
  } catch (error) {
    console.error("Get machine error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch machine",
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

    if (!canUpdateMachine(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to update machines",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid machine ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const result = machineSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const duplicateMachine = await Machine.findOne({
      machineCode: result.data.machineCode.toUpperCase(),
      _id: { $ne: id },
    });

    if (duplicateMachine) {
      return NextResponse.json(
        {
          success: false,
          message: "Another machine already uses this code",
        },
        { status: 409 }
      );
    }

    const machine = await Machine.findByIdAndUpdate(
      id,
      {
        ...result.data,
        machineCode: result.data.machineCode.toUpperCase(),
        lastMaintenanceDate:
          result.data.lastMaintenanceDate || undefined,
        nextMaintenanceDate:
          result.data.nextMaintenanceDate || undefined,
      },
      {
        new: true,
        runValidators: true,
      }
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

    return NextResponse.json({
      success: true,
      message: "Machine updated successfully",
      machine,
    });
  } catch (error) {
    console.error("Update machine error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update machine",
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

    if (!canDeleteMachine(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only administrators can delete machines",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid machine ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const machine = await Machine.findByIdAndDelete(id);

    if (!machine) {
      return NextResponse.json(
        {
          success: false,
          message: "Machine not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Machine deleted successfully",
    });
  } catch (error) {
    console.error("Delete machine error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete machine",
      },
      { status: 500 }
    );
  }
}