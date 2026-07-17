import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: { patient: true, doctor: true, availability: true },
  });
  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(appointment);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { status, date, description } = body;

  const data: any = {};
  if (status) data.status = status;
  if (date) data.date = new Date(date);
  if (description) data.description = description;

  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data,
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
