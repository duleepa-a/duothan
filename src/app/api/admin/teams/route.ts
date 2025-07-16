import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/teams - Get all teams with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'points';
    const order = searchParams.get('order') || 'desc';

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const orderBy = { [sortBy]: order };

    const [teams, totalTeams] = await Promise.all([
      prisma.team.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          submissions: {
            where: { isCorrect: true },
            select: { id: true, challengeId: true }
          },
          _count: {
            select: {
              submissions: true
            }
          }
        }
      }),
      prisma.team.count({ where })
    ]);

    const teamsWithStats = teams.map(team => ({
      ...team,
      challengesCompleted: team.submissions.length,
      totalSubmissions: team._count.submissions,
      lastActive: team.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: {
        teams: teamsWithStats,
        pagination: {
          page,
          limit,
          total: totalTeams,
          totalPages: Math.ceil(totalTeams / limit)
        }
      }
    });
  } catch (error) {
    console.error('Teams API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// POST /api/admin/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if team already exists
    const existingTeam = await prisma.team.findFirst({
      where: {
        OR: [
          { name },
          { email }
        ]
      }
    });

    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: 'Team with this name or email already exists' },
        { status: 409 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        email,
        password // In production, this should be hashed
      }
    });

    return NextResponse.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Create Team API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
