import { NextRequest, NextResponse } from "next/server";
import micromatch from "micromatch";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/dashboard/**"];

const isProtectedRoute = (req: NextRequest) => {
  return micromatch.isMatch(req.nextUrl.pathname, protectedRoutes);
};

export default async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  if (isProtectedRoute(req)) {
    if (!sessionCookie)
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
