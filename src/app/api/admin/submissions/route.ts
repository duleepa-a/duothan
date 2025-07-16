import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/submissions - Get all submissions with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // 'pending', 'correct', 'incorrect'
    const type = searchParams.get('type'); // 'ALGORITHMIC', 'BUILDATHON'
    const teamId = searchParams.get('teamId');
    const challengeId = searchParams.get('challengeId');

    const where = {
      ...(status && {
        isCorrect: status === 'correct' ? true : status === 'incorrect' ? false : undefined
      }),
      ...(type && { type: type as 'ALGORITHMIC' | 'BUILDATHON' }),
      ...(teamId && { teamId }),
      ...(challengeId && { challengeId })
    };

    const [submissions, totalSubmissions] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          team: {
            select: {
              name: true,
              email: true
            }
          },
          challenge: {
            select: {
              title: true,
              points: true
            }
          }
        }
      }),
      prisma.submission.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total: totalSubmissions,
          totalPages: Math.ceil(totalSubmissions / limit)
        }
      }
    });
  } catch (error) {
    console.error('Submissions API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
