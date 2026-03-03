import { NextResponse, type NextRequest } from "next/server";

// Routes accessible without authentication
const publicRoutes = ["/", "/api/auth"];

// Auth pages — only for unauthenticated users
const authRoutes = ["/sign-in", "/sign-up"];

function matchesAny(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getSessionToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value
  );
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Public routes — always allow
  if (matchesAny(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  const sessionToken = getSessionToken(req);

  // 2. Auth pages — redirect away if already logged in
  if (matchesAny(pathname, authRoutes)) {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/conversations", req.url));
    }
    return NextResponse.next();
  }

  // 3. All other routes require auth
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
