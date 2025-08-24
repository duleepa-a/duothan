import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  const where: any = {};
  if (status) where.status = status.toUpperCase();
  if (type) where.type = type.toUpperCase();

  const submissions = await prisma.submissions.findMany({
    where,
    include: {
      teams: true,
      challenges: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json({ submissions });
}
