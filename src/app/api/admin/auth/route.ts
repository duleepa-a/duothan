import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// POST /api/admin/auth/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find admin user in database
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    // Generate JWT token
    const token = sign(
      { 
        id: admin.id,
        username: admin.username,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          role: 'admin'
        },
        token
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// GET /api/admin/auth/me - Get current admin user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token' },
        { status: 401 }
      );
    }

    try {
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      // Get admin from database
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          isActive: true,
          lastLogin: true
        }
      });

      if (!admin || !admin.isActive) {
        return NextResponse.json(
          { success: false, error: 'Admin not found or deactivated' },
          { status: 401 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            fullName: admin.fullName,
            role: 'admin',
            lastLogin: admin.lastLogin
          }
        }
      });
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin Me API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/auth/logout - Admin logout
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the HTTP-only cookie
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Admin Logout API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
