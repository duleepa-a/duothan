import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET; // must be set

export async function GET(req: Request) {
  try {
    // 1. Extract token from cookies/headers
    console.log("Request in /api/me:", req);
    const token = await getToken({ req, secret });

    console.log("Token in /api/me:", token);

    if (!token?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Find user in DB
    const user = await prisma.competitor.findUnique({
      where: { userId: token.id as string },
      include: { 
        team: { 
          include: { competitors: true } 
        }  
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Return safe user data
    return NextResponse.json({
      id: user.id,
      fullName: user.fullName,
      isLeader: user.isLeader,
      team: user.team ? { id: user.team.id, name: user.team.name, points : user.team.points , members : user.team.competitors.length} : null,
    });
  } catch (err) {
    console.error("GET /api/me error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
