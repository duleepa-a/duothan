import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminMiddleware';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await verifyAdminToken(request);
    
    // Get total number of teams
    const totalTeams = await prisma.team.count();

    // Get total number of active challenges
    const activeChallenges = await prisma.challenge.count({
      where: { isActive: true }
    });

    // Get total submissions
    const totalSubmissions = await prisma.submission.count();

    // Get leaderboard data (top 10 teams)
    const leaderboard = await prisma.team.findMany({
      orderBy: [
        { points: 'desc' },
        { createdAt: 'asc' }
      ],
      take: 10,
      select: {
        id: true,
        name: true,
        points: true,
        currentChallenge: true,
        createdAt: true
      }
    });

    // Get submission statistics by type
    const submissionStats = await prisma.submission.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    });

    // Get recent activity (last 10 submissions)
    const recentActivity = await prisma.submission.findMany({
      take: 10,
      orderBy: { submittedAt: 'desc' },
      include: {
        team: {
          select: {
            name: true
          }
        },
        challenge: {
          select: {
            title: true
          }
        }
      }
    });

    // Get teams registration over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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

    // Group registrations by day
    const registrationsByDay = teamRegistrations.reduce((acc: Record<string, number>, team: { createdAt: Date }) => {
      const date = team.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Get challenge completion statistics
    const challengeStats = await prisma.challenge.findMany({
      include: {
        _count: {
          select: {
            submissions: {
              where: { isCorrect: true }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalTeams,
        activeChallenges,
        totalSubmissions,
        leaderboard,
        submissionStats,
        recentActivity,
        registrationsByDay,
        challengeStats
      }
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard data' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
