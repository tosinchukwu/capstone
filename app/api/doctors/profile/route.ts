import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET – fetch doctor's own profile (requires wallet address in query)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  const doctor = await prisma.user.findUnique({
    where: { wallet },
    select: {
      id: true,
      name: true,
      email: true,
      wallet: true,
      specialty: true,
      hospital: true,
      location: true,
      bio: true,
      rating: true,
      yearsExperience: true,
      isActive: true,
      autoConfirm: true,
    },
  });
  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }
  return NextResponse.json(doctor);
}

// PUT – update doctor's profile
export async function PUT(request: Request) {
  const body = await request.json();
  const { wallet, name, email, specialty, hospital, location, bio, yearsExperience, autoConfirm } = body;

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { wallet },
    data: {
      name,
      email,
      specialty,
      hospital,
      location,
      bio,
      yearsExperience: yearsExperience ? parseInt(yearsExperience) : undefined,
      autoConfirm,
    },
  });
  return NextResponse.json(updated);
}
