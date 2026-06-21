import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. demo.reportiq.app, or myagency.com)
  const hostname = req.headers.get('host') || 'reportiq.app';
  
  // Define allowed domains (including local dev)
  const isMainDomain = hostname.includes('localhost') || hostname.includes('reportiq.app') || hostname.includes('vercel.app');

  // If it's a custom domain, rewrite the request to the /_sites/[domain] dynamic route
  // For MVP we just map it to the public report view assuming the custom domain points to a specific report or agency portal.
  if (!isMainDomain && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next')) {
    // We rewrite everything to a special dynamic route, or for now, just map it to a generic domain portal page
    // Example: rewrite to /domain/[hostname]${url.pathname}
    return NextResponse.rewrite(new URL(`/domain/${hostname}${url.pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
