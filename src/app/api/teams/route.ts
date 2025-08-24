import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.teams.findMany({
      include: {
        competitors: {
          select: {
            id: true,
            fullName: true,
            isLeader: true,
          },
        },
      },
    });

    // format into frontend shape
    const formatted = teams.map((team) => ({
      id: team.id,
      name: team.name,
      points: team.points,
      challengesCompleted: 0, // TODO: compute based on submissions if needed
      members: team.competitors.map((c) => c.fullName),
    }));

    return NextResponse.json({ teams: formatted });
  } catch (err: any) {
    console.error("GET /api/teams error:", err);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, leaderId } = body;

    if (!name || !leaderId) {
      return NextResponse.json(
        { error: "Missing team name or leaderId" },
        { status: 400 }
      );
    }

    // Create team
    const newTeam = await prisma.teams.create({
      data: {
        name,
      },
    });

    await prisma.competitor.update({
      where: { id: leaderId },
      data: {
        isLeader: true,
        teamId: newTeam.id,
      },
    });

    return NextResponse.json({ team: newTeam });
  } catch (err: any) {
    console.error("POST /api/teams error:", err);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
