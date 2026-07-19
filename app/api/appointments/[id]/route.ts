import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = serializeBigInt(obj[key]);
    }
    return result;
  }
  return obj;
}

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
  const serialized = serializeBigInt(appointment);
  return NextResponse.json(serialized);
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
  const serialized = serializeBigInt(updated);
  return NextResponse.json(serialized);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.appointment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
