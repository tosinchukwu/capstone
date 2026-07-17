import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 }
      );
    }

    const slots = await prisma.availability.findMany({
      where: {
        doctorId,
        isBooked: false,
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error("GET /api/availability error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorId, date, startTime, endTime } = body;

    if (!doctorId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields: doctorId, date, startTime, endTime" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });
    if (!doctor || doctor.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Invalid doctor ID or user is not a doctor" },
        { status: 400 }
      );
    }

    // Create the slot
    const slot = await prisma.availability.create({
      data: {
        doctorId,
        date: new Date(date),
        startTime,
        endTime,
        isBooked: false,
      },
    });

    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    console.error("POST /api/availability error:", error);
    return NextResponse.json(
      { error: "Internal server error while creating slot" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }
    await prisma.availability.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/availability error:", error);
    return NextResponse.json(
      { error: "Failed to delete slot" },
      { status: 500 }
    );
  }
}
