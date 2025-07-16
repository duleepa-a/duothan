import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/challenges/[id] - Get a specific challenge
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: params.id },
      include: {
        submissions: {
          include: {
            team: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const challengeWithStats = {
      ...challenge,
      totalSubmissions: challenge.submissions.length,
      correctSubmissions: challenge.submissions.filter(s => s.isCorrect).length
    };

    return NextResponse.json({
      success: true,
      data: challengeWithStats
    });
  } catch (error) {
    console.error('Get Challenge API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch challenge' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/challenges/[id] - Update a challenge
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const challenge = await prisma.challenge.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(algorithmicProblem && { algorithmicProblem }),
        ...(buildathonProblem !== undefined && { buildathonProblem }),
        ...(flag && { flag }),
        ...(points !== undefined && { points }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order })
      }
    });

    return NextResponse.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Update Challenge API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update challenge' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/challenges/[id] - Delete a challenge
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.challenge.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Delete Challenge API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete challenge' },
      { status: 500 }
    );
  }
}
