import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const challenges = await prisma.challenges.findMany({
    include: { testCases: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ challenges });
}

export async function POST(req: Request) {
  const body = await req.json();
  const challenge = await prisma.challenges.create({
    data: {
      title: body.title,
      description: body.description,
      algorithmicProblem: body.algorithmicProblem,
      buildathonProblem: body.buildathonProblem,
      flag: body.flag,
      points: Number(body.points),
      order: Number(body.order),
      testCases: {
        create: body.testCases || [],
      },
    },
  });
  return NextResponse.json(challenge);
}
