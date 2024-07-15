import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/app/utils/jwt";
import createIntlMiddleware from "next-intl/middleware";

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PAGES = ["/dashboard", "/settings"]; // Protected pages

const isAuthPages = (url) => AUTH_PAGES.some((page) => page.startsWith(url));
const isProtectedPage = (url) =>
  PROTECTED_PAGES.some((page) => page.startsWith(url));

export default async function middleware(request) {
  const { nextUrl, cookies } = request;
  const { value: token } = cookies.get("JWT") ?? { value: null };

  const hasVerifiedToken = token && (await verifyJwtToken(token));
  const isAuthPageRequested = isAuthPages(nextUrl.pathname);
  const isProtectedPageRequested = isProtectedPage(nextUrl.pathname);

  if (nextUrl.pathname === "/") {
    // Redirect root path to the default locale
    return NextResponse.redirect(new URL("/en", request.url));
  }

  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete("JWT");
      return response;
    }
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  // Access control for protected pages
  if (isProtectedPageRequested && !hasVerifiedToken) {
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    searchParams.set("next", nextUrl.pathname);

    const response = NextResponse.redirect(
      new URL(`/login?${searchParams}`, request.url)
    );
    response.cookies.delete("JWT");

    return response;
  }

  // Call the next middleware in the chain
  const intlMiddleware = createIntlMiddleware({
    defaultLocale: "en",
    locales: ["en", "tr"],
    localeDetection: true,
  });

  const response = await intlMiddleware(request);
  return response;
}

// Middleware configuration for next-intl
export const config = {
  matcher: ["/", "/(tr|en)/:path*"],
};
