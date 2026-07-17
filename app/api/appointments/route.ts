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
  const body = await request.json();
  const { chainAppointmentId, patientId, doctorId, date, description, status, availabilityId } = body;

  // Validate
  if (!chainAppointmentId || !patientId || !doctorId || !date || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check if doctor auto-confirms
  const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
  let finalStatus = status || (doctor?.autoConfirm ? "CONFIRMED" : "PENDING");

  // If availabilityId provided, mark slot as booked
  if (availabilityId) {
    await prisma.availability.update({
      where: { id: availabilityId },
      data: { isBooked: true },
    });
  }

  const appointment = await prisma.appointment.create({
    data: {
      chainAppointmentId,
      patientId,
      doctorId,
      date: new Date(date),
      description,
      status: finalStatus,
      availabilityId,
    },
    include: {
      patient: true,
      doctor: true,
      availability: true,
    },
  });
  return NextResponse.json(appointment, { status: 201 });
}
