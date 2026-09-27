import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, localeFromPath, negotiateLocale } from "@/lib/i18n";

// Sends paths without a language prefix ("/", "/foo") to the visitor's language:
// explicit choice (cookie) first, then Accept-Language, then English.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (localeFromPath(pathname)) return;

  const locale = negotiateLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  // The redirect target depends on these headers; keep shared caches from mixing languages.
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // Skip Next internals, metadata routes and any file with an extension (images, icons…).
  matcher: ["/((?!_next/|api/|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|.*\\..*).*)"],
};
