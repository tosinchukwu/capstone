import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");
  const status = searchParams.get("status");

  const where: any = {};
  if (patientId) where.patientId = patientId;
  if (doctorId) where.doctorId = doctorId;
  if (status) where.status = status;

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: true,
      doctor: true,
      availability: true,
    },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chainAppointmentId, patientId, doctorId, date, description, status, availabilityId } = body;

    // Validate required fields
    if (!chainAppointmentId || !patientId || !doctorId || !date || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if patient and doctor exist (optional but good)
    const patient = await prisma.user.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Determine status: auto-confirm if doctor has autoConfirm enabled
    let finalStatus = status || (doctor.autoConfirm ? "CONFIRMED" : "PENDING");

    // If availabilityId provided, mark slot as booked
    if (availabilityId) {
      const slot = await prisma.availability.findUnique({
        where: { id: availabilityId },
      });
      if (!slot) {
        return NextResponse.json({ error: "Slot not found" }, { status: 404 });
      }
      if (slot.isBooked) {
        return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
      }
      // Mark slot as booked
      await prisma.availability.update({
        where: { id: availabilityId },
        data: { isBooked: true },
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        chainAppointmentId,
        patientId,
        doctorId,
        date: new Date(date),
        description,
        status: finalStatus,
        availabilityId: availabilityId || null,
      },
      include: {
        patient: true,
        doctor: true,
        availability: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
