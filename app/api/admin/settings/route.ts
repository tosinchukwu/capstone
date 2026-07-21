import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET || "0xYourAdminWalletAddress";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  if (wallet !== ADMIN_WALLET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let settings = await prisma.hospitalSettings.findFirst();
  if (!settings) {
    settings = await prisma.hospitalSettings.create({ data: { name: "My Hospital" } });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  if (wallet !== ADMIN_WALLET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  let settings = await prisma.hospitalSettings.findFirst();
  if (!settings) {
    settings = await prisma.hospitalSettings.create({ data: { name: "My Hospital" } });
  }

  const updated = await prisma.hospitalSettings.update({
    where: { id: settings.id },
    data,
  });
  return NextResponse.json(updated);
}
