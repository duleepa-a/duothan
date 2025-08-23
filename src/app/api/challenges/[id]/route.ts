import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const challenge = await prisma.challenges.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            teams: true, // include team info for context
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(challenge, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/challenges/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedChallenge = await prisma.challenges.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        order: body.order,
        isActive: body.isActive,
        algorithmicProblem: body.algorithmicProblem,
        buildathonProblem: body.buildathonProblem,
        flag: body.flag,
        points: body.points,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedChallenge, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/challenges/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.challenges.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Challenge deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/challenges/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete challenge" },
      { status: 500 }
    );
  }
}
