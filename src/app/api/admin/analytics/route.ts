import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/analytics/overview - Get analytics overview
export async function GET(request: NextRequest) {
  try {
    const [
      totalTeams,
      totalChallenges,
      totalSubmissions,
      activeChallenges,
      completedSubmissions,
      pendingSubmissions
    ] = await Promise.all([
      prisma.team.count(),
      prisma.challenge.count(),
      prisma.submission.count(),
      prisma.challenge.count({ where: { isActive: true } }),
      prisma.submission.count({ where: { isCorrect: true } }),
      prisma.submission.count({ where: { isCorrect: false } })
    ]);

    // Get submission trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSubmissions = await prisma.submission.findMany({
      where: {
        submittedAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        submittedAt: true,
        isCorrect: true,
        type: true
      }
    });

    // Group submissions by day
    const submissionsByDay = recentSubmissions.reduce((acc: Record<string, any>, submission) => {
      const date = submission.submittedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          correct: 0,
          incorrect: 0,
          algorithmic: 0,
          buildathon: 0
        };
      }
      acc[date].total++;
      if (submission.isCorrect) acc[date].correct++;
      else acc[date].incorrect++;
      if (submission.type === 'ALGORITHMIC') acc[date].algorithmic++;
      else acc[date].buildathon++;
      return acc;
    }, {});

    // Get team registration trends
    const teamRegistrations = await prisma.team.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true
      }
    });

    const registrationsByDay = teamRegistrations.reduce((acc: Record<string, number>, team) => {
      const date = team.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Get top performing teams
    const topTeams = await prisma.team.findMany({
      orderBy: [
        { points: 'desc' },
        { createdAt: 'asc' }
      ],
      take: 10,
      select: {
        id: true,
        name: true,
        points: true,
        createdAt: true,
        _count: {
          select: {
            submissions: {
              where: { isCorrect: true }
            }
          }
        }
      }
    });

    // Get challenge completion rates
    const challengeStats = await prisma.challenge.findMany({
      select: {
        id: true,
        title: true,
        points: true,
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    const challengeCompletionRates = await Promise.all(
      challengeStats.map(async (challenge) => {
        const correctSubmissions = await prisma.submission.count({
          where: {
            challengeId: challenge.id,
            isCorrect: true
          }
        });

        return {
          ...challenge,
          completionRate: totalTeams > 0 ? Math.round((correctSubmissions / totalTeams) * 100) : 0,
          correctSubmissions
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalTeams,
          totalChallenges,
          totalSubmissions,
          activeChallenges,
          completedSubmissions,
          pendingSubmissions,
          completionRate: totalSubmissions > 0 ? Math.round((completedSubmissions / totalSubmissions) * 100) : 0
        },
        trends: {
          submissionsByDay: Object.values(submissionsByDay),
          registrationsByDay
        },
        topTeams: topTeams.map(team => ({
          ...team,
          challengesCompleted: team._count.submissions
        })),
        challengeStats: challengeCompletionRates
      }
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
