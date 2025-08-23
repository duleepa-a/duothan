import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/challenges - Get all challenges with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      }),
      ...(isActive !== null && { isActive: isActive === 'true' })
    };

    const [challenges, totalChallenges] = await Promise.all([
      prisma.challenges.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: {
              submissions: true
            }
          }
        }
      }),
      prisma.challenges.count({ where })
    ]);

    const challengesWithStats = challenges.map(challenge => ({
      ...challenge,
      totalSubmissions: challenge._count.submissions
    }));

    return NextResponse.json({
      success: true,
      data: {
        challenges: challengesWithStats,
        pagination: {
          page,
          limit,
          total: totalChallenges,
          totalPages: Math.ceil(totalChallenges / limit)
        }
      }
    });
  } catch (error) {
    console.error('Challenges API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

// POST /api/admin/challenges - Create a new challenge
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      algorithmicProblem,
      buildathonProblem,
      flag,
      points,
      isActive,
      order
    } = await request.json();

    if (!title || !description || !algorithmicProblem || !flag || !order) {
      return NextResponse.json(
        { success: false, error: 'Title, description, algorithmic problem, flag, and order are required' },
        { status: 400 }
      );
    }

    // Check if order already exists
    const existingChallenge = await prisma.challenges.findUnique({
      where: { order }
    });

    if (existingChallenge) {
      return NextResponse.json(
        { success: false, error: 'Challenge with this order already exists' },
        { status: 409 }
      );
    }

    const challenge = await prisma.challenges.create({
      data: {
        title,
        description,
        algorithmicProblem,
        buildathonProblem,
        flag,
        points: points || 100,
        isActive: isActive !== false,
        order
      }
    });

    return NextResponse.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Create Challenge API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}
