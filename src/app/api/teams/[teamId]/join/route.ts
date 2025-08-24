import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params;
    console.log("teamId:", teamId);
    const body = await req.json();
    const { userId } = body;

    console.log("userId:", userId);

    if (!teamId || !userId) {
      return NextResponse.json(
        { error: "Missing teamId or userId" },
        { status: 400 }
      );
    }

    const competitor = await prisma.competitor.findUnique({
      where: { id: userId },
    });

    if (!competitor) {
      return NextResponse.json(
        { error: "Competitor not found" },
        { status: 404 }
      );
    }

    // Check if already in a team
    if (competitor.teamId) {
      return NextResponse.json(
        { error: "Already in a team" },
        { status: 400 }
      );
    }

    // Check team size
    const team = await prisma.teams.findUnique({
      where: { id: teamId },
      include: { competitors: true },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (team.competitors.length >= 5) {
      return NextResponse.json(
        { error: "Team is full" },
        { status: 400 }
      );
    }

    await prisma.competitor.update({
      where: { id: userId },
      data: {
        teamId: teamId,
        isLeader: false,
      },
    });

    return NextResponse.json({ message: "Joined team successfully" });
  } catch (err: any) {
    console.error("POST /api/teams/[teamId]/join error:", err);
    return NextResponse.json(
      { error: "Failed to join team" },
      { status: 500 }
    );
  }
}
