import { NextResponse } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete({
      name: ADMIN_SESSION_COOKIE,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Error during admin logout:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

