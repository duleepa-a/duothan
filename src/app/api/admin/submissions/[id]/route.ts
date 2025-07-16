import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/submissions/[id] - Get a specific submission
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: {
        team: {
          select: {
            name: true,
            email: true,
            points: true
          }
        },
        challenge: {
          select: {
            title: true,
            description: true,
            algorithmicProblem: true,
            buildathonProblem: true,
            flag: true,
            points: true
          }
        }
      }
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Get Submission API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/submissions/[id] - Update submission status (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isCorrect, feedback } = await request.json();

    if (isCorrect === undefined) {
      return NextResponse.json(
        { success: false, error: 'isCorrect status is required' },
        { status: 400 }
      );
    }

    // Start a transaction to update submission and team points
    const result = await prisma.$transaction(async (tx) => {
      // Update submission
      const submission = await tx.submission.update({
        where: { id: params.id },
        data: {
          isCorrect,
          ...(feedback && { feedback })
        },
        include: {
          team: true,
          challenge: {
            select: {
              points: true
            }
          }
        }
      });

      // If submission is marked as correct, update team points
      if (isCorrect) {
        await tx.team.update({
          where: { id: submission.teamId },
          data: {
            points: {
              increment: submission.challenge.points
            }
          }
        });
      }

      return submission;
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Update Submission API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/submissions/[id] - Delete a submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.submission.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Delete Submission API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
