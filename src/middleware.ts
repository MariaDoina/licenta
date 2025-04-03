import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Căi publice, unde utilizatorii pot accesa fără autentificare
  const isPublicPath =
    path === "/login" || path === "/signup" || path === "/verifyemail";

  // Verificăm dacă există un token în cookie
  const token = request.cookies.get("token")?.value || "";

  // Dacă utilizatorul este deja autentificat și încearcă să acceseze pagini publice (login/signup)
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl)); // Redirecționează către profile
  }

  // Dacă utilizatorul nu este autentificat și încearcă să acceseze orice pagină în afară de "/"
  if (!isPublicPath && !token && path !== "/") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile", "/login", "/signup", "/verifyemail"],
};
