/**
 * Guest Identity Middleware
 * 
 * Validates guest token format (UUID) and passes to downstream Server Components.
 * Runs on Edge Runtime - cannot access Mongoose/DB directly.
 * 
 * Flow:
 * 1. Check for ?token=UUID in URL
 * 2. Validate UUID format (regex only, DB check in layout)
 * 3. Set x-guest-token header + HttpOnly cookie
 * 4. Redirect to /error if invalid/missing
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Skip admin routes (separate auth logic)
    if (pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Skip error page to prevent redirect loop
    if (pathname === '/error') {
        return NextResponse.next();
    }

    // 1. Prioritize URL Token
    let token = searchParams.get('token');
    let source = 'url';

    // 2. Fallback to Cookie
    if (!token) {
        const cookie = request.cookies.get('guest-token');
        token = cookie?.value || null;
        source = 'cookie';
    }

    // 3. Validation
    if (!token || !UUID_REGEX.test(token)) {
        return NextResponse.redirect(new URL('/error', request.url));
    }

    // 4. Success - Forward Request
    const response = NextResponse.next();

    // Pass token to Server Components via Header
    response.headers.set('x-guest-token', token);

    // 5. If we got a fresh URL token, update/set the cookie
    // This allows "switching users" by just clicking a new link
    if (source === 'url') {
        response.cookies.set('guest-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
    }

    return response;
}

// Exclude Next.js internal routes, static files, and API routes
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api|error).*)'],
};
