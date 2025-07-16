import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import SignUpdata from './schema';
const SALTRounds = 12;
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const email = req.headers.get('email');
  if (!email) {
    return NextResponse.json({ message: 'Email header is required' }, { status: 400 });
  }

  const existingUser = await prisma.userProfile.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ 
      message: 'User with this email already exists' 
    }, { status: 409 });
  }

  return NextResponse.json({ message: 'Valid email' }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = SignUpdata.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        errors: validation.error.errors 
      }, { status: 400 });
    }

    const existingUser = await prisma.userProfile.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'User with this email already exists' 
      }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(body.password, SALTRounds);

    // Create the user profile
    const newUser = await prisma.userProfile.create({
      data: {
        email: body.email,
        password: hashedPassword,
        role: 'COMPETITOR',
        createdAt: new Date(),
        activeStatus: true,
      }
    });

    // Create the COMPETITOR entry
    const newCompetitor = await prisma.competitor.create({
      data: {
        fullName: body.fullName, // Make sure your schema expects fullName
        contactNo: body.contactNumber,
        userId: newUser.id,
      }
    });

    if (!newUser || !newCompetitor) {
      return NextResponse.json({ 
        message: 'User registration failed' 
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'User registered successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === '23505') { 
      return NextResponse.json({ 
        message: 'User with this email already exists' 
      }, { status: 409 });
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}