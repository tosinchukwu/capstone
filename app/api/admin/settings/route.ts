import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET || "0xYourAdminWalletAddress";

// ✅ GET – public (no auth required) – for displaying hospital info on the homepage
export async function GET() {
  try {
    let settings = await prisma.hospitalSettings.findFirst();
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.hospitalSettings.create({
        data: {
          name: "MEDCRUSH BLOCKCHAIN HOSPITAL",
          email: "medcrush@gmail.com",
          phone: "08023000000",
          address: "2, Hospital Road, Benin",
          website: "",
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching hospital settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// ✅ PUT – requires admin wallet
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");
    if (wallet !== ADMIN_WALLET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    let settings = await prisma.hospitalSettings.findFirst();
    if (!settings) {
      settings = await prisma.hospitalSettings.create({
        data: {
          name: "MEDCRUSH BLOCKCHAIN HOSPITAL",
          email: "medcrush@gmail.com",
          phone: "08023000000",
          address: "2, Hospital Road, Benin",
          website: "",
        },
      });
    }

    const updated = await prisma.hospitalSettings.update({
      where: { id: settings.id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating hospital settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}