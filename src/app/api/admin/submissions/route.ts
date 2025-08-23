import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get('limit') || 5);
    const submissions = await prisma.submissions.findMany({
      orderBy: { submittedAt: 'desc' },
      take: limit,
      include: {
        teams: { select: { id: true, name: true } },
        challenges: { select: { id: true, title: true } }
      }
    });

    return NextResponse.json({ submissions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch recent submissions' }, { status: 500 });
  }
}
