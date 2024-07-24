import { NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { verifyJwtToken } from "./app/utils/jwt";
import createIntlMiddleware from "next-intl/middleware";

const I18nMiddleware = createIntlMiddleware({
  locales: ["en", "tr"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PAGES = ["/home", "/settings", "/admin"];

const isAuthPage = (url) => AUTH_PAGES.includes(url);
const isProtectedPage = (url) =>
  PROTECTED_PAGES.some((page) => url.startsWith(page));

export async function middleware(request, event) {
  const { nextUrl, cookies } = request;
  const tokenObj = cookies.get("JWT");

  const token = tokenObj?.value;

  let hasVerifiedToken = false;
  let payload = null;
  if (token) {
    try {
      payload = await verifyJwtToken(token);
      hasVerifiedToken = !!payload;
    } catch (error) {
      throw new Error("Token verification failed: " + error);
    }
  }

  const locale = nextUrl.pathname.split("/")[1] || "en";

  const pathWithoutLocale = nextUrl.pathname.replace(`/${locale}`, "");
  const isAuthPageRequested = isAuthPage(pathWithoutLocale);
  const isProtectedPageRequested = isProtectedPage(pathWithoutLocale);

  console.log(nextUrl.pathname, "nextUrl.pathname");
  console.log(pathWithoutLocale, "pathWithoutLocale");

  if (isAuthPageRequested && hasVerifiedToken) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  if (isProtectedPageRequested && !hasVerifiedToken) {
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    searchParams.set("next", nextUrl.pathname);

    return NextResponse.redirect(
      new URL(`/${locale}/login?${searchParams}`, request.url)
    );
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",
    "/",
    "/[locale]/:path*",
  ],
};
