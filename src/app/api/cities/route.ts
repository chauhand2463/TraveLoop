import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const cities = await prisma.city.findMany({ orderBy: { popularity: "desc" } });
  return NextResponse.json(cities);
}
