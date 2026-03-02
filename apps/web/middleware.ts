import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/auth"];
const orgFreeRoutes = ["/sign-in", "/sign-up", "/org-selection"];

function isPublic(pathname: string) {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isOrgFree(pathname: string) {
  return orgFreeRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes through
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  // On HTTPS (production) better-auth prefixes with __Secure-
  const sessionToken =
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Check for active organization cookie  
  const activeOrgId = req.cookies.get("active_organization_id")?.value;

  if (!activeOrgId && !isOrgFree(pathname)) {
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
