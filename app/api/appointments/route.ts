import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateAppointmentInput } from '@/types/database';

// GET all appointments (with patient and doctor relations)
export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: true,
    },
  });
  return NextResponse.json(appointments);
}

// POST create a new appointment (store off‑chain details)
export async function POST(request: Request) {
  const body: CreateAppointmentInput = await request.json();

  // Ensure patient and doctor exist (or create them if needed)
  // You might want to validate that they exist in the DB before creating.

  const newAppointment = await prisma.appointment.create({
    data: {
      chainAppointmentId: BigInt(body.chainAppointmentId), // from contract
      patientId: body.patientId,
      doctorId: body.doctorId,
      date: new Date(body.date),
      description: body.description,
      status: body.status || 'PENDING',
    },
    include: {
      patient: true,
      doctor: true,
    },
  });

  return NextResponse.json(newAppointment, { status: 201 });
}
