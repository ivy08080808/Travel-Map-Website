import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/auth';

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_VALUE = 'authenticated';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (verifyAdminPassword(password)) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

