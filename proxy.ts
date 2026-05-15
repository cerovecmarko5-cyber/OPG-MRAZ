import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Ako nije prijavljen i pokušava pristupiti dashboardu → na login
  if (pathname.startsWith('/admin/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Ako JE prijavljen i ide na login stranicu → odmah na dashboard
  if (pathname === '/admin' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }
});

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
