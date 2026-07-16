import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: { patient: true, doctor: true },
  });
  if (!appointment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(appointment);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data: {
      status: body.status,   // e.g., 'CONFIRMED' or 'COMPLETED'
      // other fields can be updated as needed
    },
    include: { patient: true, doctor: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.appointment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
