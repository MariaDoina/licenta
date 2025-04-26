import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Route lists
  const isPublicPath = path === "/login" || path === "/signup";

  // Check if the user is logged in by checking the token in cookies
  const token = request.cookies.get("token")?.value || "";

  // If user is logged and he tries to access public paths redirect him to the profile page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl)); // Redirecționează către profile
  }

  // If user is not logged in and he tries to access protected paths redirect him to the login page
  if (!isPublicPath && !token && path !== "/") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
    "/create_recipe",
  ],
};
