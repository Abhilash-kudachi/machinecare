import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Machine from "@/models/Machine";
import { getCurrentUser } from "@/lib/auth";
import { canCreateMachine } from "@/lib/permissions";
import { machineSchema } from "@/validations/machine";

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

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "";

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        {
          machineName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          machineCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          manufacturer: {
            $regex: search,
            $options: "i",
          },
        },
        {
          model: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (
      status &&
      ["OPERATIONAL", "MAINTENANCE", "CRITICAL", "INACTIVE"].includes(
        status
      )
    ) {
      filter.status = status;
    }

    const machines = await Machine.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      machines,
    });
  } catch (error) {
    console.error("Get machines error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch machines",
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

    if (!canCreateMachine(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to create machines",
        },
        { status: 403 }
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

    const existingMachine = await Machine.findOne({
      machineCode: result.data.machineCode.toUpperCase(),
    });

    if (existingMachine) {
      return NextResponse.json(
        {
          success: false,
          message: "A machine with this code already exists",
        },
        { status: 409 }
      );
    }

    const machine = await Machine.create({
      ...result.data,
      machineCode: result.data.machineCode.toUpperCase(),
      createdBy: user.userId,
      lastMaintenanceDate:
        result.data.lastMaintenanceDate || undefined,
      nextMaintenanceDate:
        result.data.nextMaintenanceDate || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Machine created successfully",
        machine,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create machine error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create machine",
      },
      { status: 500 }
    );
  }
}