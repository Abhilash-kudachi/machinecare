import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
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

    const role = searchParams.get("role");

    const filter: Record<string, unknown> = {};

    if (
      role &&
      ["ADMIN", "MANAGER", "TECHNICIAN"].includes(role)
    ) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("_id name email role")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch users",
      },
      { status: 500 }
    );
  }
}