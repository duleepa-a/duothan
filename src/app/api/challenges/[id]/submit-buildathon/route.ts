import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id: challengeId } = params;
  const { teamId, githubLink } = await req.json();

  const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+/;
  if (!githubRegex.test(githubLink))
    return NextResponse.json({ success: false, error: 'Invalid GitHub link' }, { status: 400 });

  const submission = await prisma.submissions.create({
    data: {
      teamId,
      challengeId,
      githubLink,
      type: 'BUILDATHON',
      status: 'ACCEPTED',
      points: 50,
    },
  });

  await prisma.teams.update({
    where: { id: teamId },
    data: { points: { increment: submission.points }, currentChallenge: { increment: 1 } },
  });

  return NextResponse.json({ success: true });
}
