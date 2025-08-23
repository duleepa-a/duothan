import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalTeams = await prisma.teams.count();
    const activeChallenges = await prisma.challenges.count({ where: { isActive: true } });
    const totalSubmissions = await prisma.submissions.count();

    const acceptedSubmissions = await prisma.submissions.count({
      where: { status: 'ACCEPTED' }
    });
    const completionRate = totalSubmissions > 0
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0;

    const topTeams = await prisma.teams.findMany({
      orderBy: { points: 'desc' },
      take: 5,
      select: { id: true, name: true, points: true }
    });

    return NextResponse.json({
      overview: { totalTeams, activeChallenges, totalSubmissions, completionRate },
      topTeams
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
