import prisma from "@/lib/prisma"; 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id: challengeId } = params;
  const { teamId, flag } = await req.json();

  const challenge = await prisma.challenges.findUnique({ where: { id: challengeId } });
  if (!challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });

  const isCorrect = challenge.flag === flag;

  await prisma.submissions.create({
    data: {
      teamId : 'cmd5q4g9j0006bi8thcdum0r3',
      challengeId,
      flagSubmitted: flag,
      isCorrect,
      points: isCorrect ? challenge.points : 0,
      type: 'ALGORITHMIC',
      status: isCorrect ? 'ACCEPTED' : 'REJECTED',
    },
  });

  if (isCorrect) {
    await prisma.teams.update({
      where: { id: 'cmd5q4g9j0006bi8thcdum0r3' },
      data: { points: { increment: challenge.points }, currentChallenge: { increment: 1 } },
    });
  }

  return NextResponse.json({ success: true, isCorrect });
}
