import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication at all
const publicRoutes = ["/", "/api/auth", "/org-selection"];

// Auth pages — only accessible when NOT logged in
const authRoutes = ["/sign-in", "/sign-up"];

function matchesAny(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getSessionToken(req: NextRequest): string | undefined {
  // On HTTPS (production) better-auth prefixes cookies with __Secure-
  return (
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value
  );
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Always allow public routes through (landing, auth API, org-selection)
  if (matchesAny(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  const sessionToken = getSessionToken(req);

  // 2. Auth pages (/sign-in, /sign-up): redirect AWAY if already logged in
  if (matchesAny(pathname, authRoutes)) {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/org-selection", req.url));
    }
    return NextResponse.next();
  }

  // 3. Everything below requires a session
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 4. All dashboard routes require an active organization
  const activeOrgId = req.cookies.get("active_organization_id")?.value;

  if (!activeOrgId) {
    return NextResponse.redirect(new URL("/org-selection", req.url));
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
