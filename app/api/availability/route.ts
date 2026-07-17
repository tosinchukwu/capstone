import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET – fetch available slots for a doctor
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  if (!doctorId) {
    return NextResponse.json({ error: "doctorId required" }, { status: 400 });
  }

  const where: any = { doctorId, isBooked: false };
  if (date) {
    const d = new Date(date);
    where.date = { gte: d, lt: new Date(d.getTime() + 86400000) };
  }

  const slots = await prisma.availability.findMany({
    where,
    orderBy: { date: "asc" },
  });
  return NextResponse.json(slots);
}

// POST – create a new slot (doctor only)
export async function POST(request: Request) {
  const body = await request.json();
  const { doctorId, date, startTime, endTime } = body;

  if (!doctorId || !date || !startTime || !endTime) {
    return NextResponse.json(
      { error: "All fields (doctorId, date, startTime, endTime) are required" },
      { status: 400 }
    );
  }

  // Check doctor exists
  const doctor = await prisma.user.findUnique({
    where: { id: doctorId },
  });
  if (!doctor || doctor.role !== "DOCTOR") {
    return NextResponse.json({ error: "Invalid doctor" }, { status: 400 });
  }

  try {
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
    console.error("Error creating slot:", error);
    return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
  }
}

// DELETE – remove a slot
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  await prisma.availability.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
