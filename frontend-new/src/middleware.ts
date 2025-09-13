import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if user is on login page
    if (request.nextUrl.pathname === '/login') {
        return NextResponse.next()
    }

    // Check for API key in request headers (from localStorage on client side)
    // Since we can't access localStorage in middleware, we'll handle this on client side
    return NextResponse.next()
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
}
