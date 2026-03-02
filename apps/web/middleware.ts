import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication at all
const publicRoutes = ["/", "/api/auth"];

// Auth pages — only accessible when NOT logged in
const authRoutes = ["/sign-in", "/sign-up"];

// Routes that require a session but NOT an active organization
const orgFreeRoutes = ["/org-selection"];

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

  // 1. Always allow truly public routes (landing page, API auth endpoints)
  if (matchesAny(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  const sessionToken = getSessionToken(req);

  // 2. Auth pages (/sign-in, /sign-up): redirect AWAY if already logged in
  if (matchesAny(pathname, authRoutes)) {
    if (sessionToken) {
      // Already authenticated → send to org-selection (or conversations if org set)
      const activeOrgId = req.cookies.get("active_organization_id")?.value;
      const dest = activeOrgId ? "/conversations" : "/org-selection";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    // Not logged in → show the auth page
    return NextResponse.next();
  }

  // 3. Everything below requires a session
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 4. Org-free routes (like /org-selection) — session required, org not required
  if (matchesAny(pathname, orgFreeRoutes)) {
    return NextResponse.next();
  }

  // 5. All other routes require an active organization
  const activeOrgId = req.cookies.get("active_organization_id")?.value;

  if (!activeOrgId) {
    const searchParams = new URLSearchParams({ redirectUrl: req.url });
    return NextResponse.redirect(
      new URL(`/org-selection?${searchParams.toString()}`, req.url)
    );
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
