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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  const patientWallet = searchParams.get("patientWallet");
  const doctorId = searchParams.get("doctorId");
  const status = searchParams.get("status");

  const where: any = {};

  // Handle patient filtering – support both UUID and wallet
  if (patientId) {
    const user = await prisma.user.findUnique({ where: { id: patientId } });
    if (user) {
      where.patientId = user.id;
    } else {
      const userByWallet = await prisma.user.findUnique({ where: { wallet: patientId } });
      if (userByWallet) {
        where.patientId = userByWallet.id;
      } else {
        return NextResponse.json([]);
      }
    }
  } else if (patientWallet) {
    const user = await prisma.user.findUnique({ where: { wallet: patientWallet } });
    if (user) {
      where.patientId = user.id;
    } else {
      return NextResponse.json([]);
    }
  }

  if (doctorId) {
    // If doctorId is a wallet address, find the user by wallet
    const doctor = await prisma.user.findUnique({ where: { wallet: doctorId } });
    if (doctor) {
      where.doctorId = doctor.id;
    } else {
      // Assume it's already a UUID
      where.doctorId = doctorId;
    }
  }
  if (status) where.status = status;

  try {
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
        availability: true,
      },
      orderBy: { date: "asc" },
    });
    const serialized = serializeBigInt(appointments);
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      chainAppointmentId,
      patientWallet,
      patientName,
      doctorId,
      date,
      description,
      status,
      availabilityId,
    } = body;

    const missingFields: string[] = [];
    if (chainAppointmentId === undefined || chainAppointmentId === null)
      missingFields.push("chainAppointmentId");
    if (!patientWallet) missingFields.push("patientWallet");
    if (!doctorId) missingFields.push("doctorId");
    if (!date) missingFields.push("date");
    if (!description) missingFields.push("description");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    let patient = await prisma.user.findUnique({
      where: { wallet: patientWallet },
    });
    if (!patient) {
      patient = await prisma.user.create({
        data: {
          wallet: patientWallet,
          name: patientName || "Patient",
          role: "PATIENT",
        },
      });
    } else {
      if (patientName && patient.name !== patientName) {
        patient = await prisma.user.update({
          where: { wallet: patientWallet },
          data: { name: patientName },
        });
      }
    }

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });
    if (!doctor || doctor.role !== "DOCTOR") {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    let finalStatus = status || (doctor.autoConfirm ? "CONFIRMED" : "PENDING");

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
      await prisma.availability.update({
        where: { id: availabilityId },
        data: { isBooked: true },
      });
    }

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

    const serialized = serializeBigInt(appointment);
    return NextResponse.json(serialized, { status: 201 });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment: " + (error as Error).message },
      { status: 500 }
    );
  }
}