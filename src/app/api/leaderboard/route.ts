import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const teams = await prisma.teams.findMany({
    select: { id: true, name: true, points: true, currentChallenge: true },
    orderBy: { points: 'desc' },
  });
  return NextResponse.json(teams);
}
