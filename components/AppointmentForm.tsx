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
    const { chainAppointmentId, patientWallet, patientName, doctorId, date, description, status, availabilityId } = body;

    // Validate required fields
    if (!chainAppointmentId || !patientWallet || !doctorId || !date || !description) {
      return NextResponse.json(
        { error: "Missing required fields: chainAppointmentId, patientWallet, doctorId, date, description" },
        { status: 400 }
      );
    }

    // Find or create patient
    let patient = await prisma.user.findUnique({
      where: { wallet: patientWallet },
    });
    if (!patient) {
      // Create a new patient user
      patient = await prisma.user.create({
        data: {
          wallet: patientWallet,
          name: patientName || "Patient",
          role: "PATIENT",
        },
      });
    } else {
      // Optionally update name if provided
      if (patientName && patient.name !== patientName) {
        patient = await prisma.user.update({
          where: { wallet: patientWallet },
          data: { name: patientName },
        });
      }
    }

    // Check if doctor exists
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });
    if (!doctor || doctor.role !== "DOCTOR") {
      return NextResponse.json({ error: "Doctor not found or not a doctor" }, { status: 404 });
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
        chainAppointmentId: BigInt(chainAppointmentId),
        patientId: patient.id,
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
      { error: "Failed to create appointment: " + (error as Error).message },
      { status: 500 }
    );
  }
}