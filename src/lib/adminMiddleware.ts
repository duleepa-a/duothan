import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function createAdminMiddleware() {
  return async (request: NextRequest) => {
    try {
      const token = request.cookies.get('admin_token')?.value;

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      try {
        const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        if (typeof decoded === 'object' && decoded.role !== 'admin') {
          return NextResponse.json(
            { success: false, error: 'Admin access required' },
            { status: 403 }
          );
        }

        // Add user info to request headers for use in the API routes
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', 'admin');
        requestHeaders.set('x-user-role', 'admin');

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (jwtError) {
        return NextResponse.json(
          { success: false, error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Admin Middleware Error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

// Utility function to verify admin token in API routes
export async function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    throw new Error('No authentication token');
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (typeof decoded === 'object' && decoded.role !== 'admin') {
      throw new Error('Admin access required');
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
}
