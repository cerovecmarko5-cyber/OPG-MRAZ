import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAdminDashboard = req.nextUrl.pathname.startsWith('/admin/dashboard');

  if (isAdminDashboard && !req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }
});

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
