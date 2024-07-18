import { NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { verifyJwtToken } from "./app/utils/jwt";
import createIntlMiddleware from "next-intl/middleware";

// Dil çevirisi middleware'ini oluşturun
const I18nMiddleware = createIntlMiddleware({
  locales: ["en", "tr"], // Dillerinizi buraya ekleyin
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PAGES = ["/home", "/settings", "/admin"]; // Protected pages

const isAuthPage = (url) => AUTH_PAGES.includes(url);
const isProtectedPage = (url) =>
  PROTECTED_PAGES.some((page) => url.startsWith(page));

export async function middleware(request, event) {
  const { nextUrl, cookies } = request;
  const tokenObj = cookies.get("JWT");
  const token = tokenObj?.value;

  // console.log("Middleware çalışıyor! URL:", request.url);
  // console.log("Token middleware:", token);

  let hasVerifiedToken = false;
  let payload = null;
  if (token) {
    try {
      payload = await verifyJwtToken(token);
      hasVerifiedToken = !!payload; // Payload varsa true, yoksa false yapar
      // console.log("Token doğrulandı:", hasVerifiedToken, "Payload:", payload);
    } catch (error) {
      throw new Error("Token verification failed: " + error);
      // console.error("Token verification failed:", error);
    }
  }

  const locale = nextUrl.pathname.split("/")[1] || "en"; // Varsayılan olarak 'en' kullanılır

  const pathWithoutLocale = nextUrl.pathname.replace(`/${locale}`, "");
  const isAuthPageRequested = isAuthPage(pathWithoutLocale);
  const isProtectedPageRequested = isProtectedPage(pathWithoutLocale);

  console.log(nextUrl.pathname, "nextUrl.pathname");
  console.log(pathWithoutLocale, "pathWithoutLocale");

  // if (nextUrl.pathname === `/`) {
  //   console.log("Root path yönlendirmesi yapılıyor.");
  //   return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  // }

  if (isAuthPageRequested && hasVerifiedToken) {
    // console.log(
    //   "Authenticated user tries to access auth page, redirecting to home."
    // );
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  if (isProtectedPageRequested && !hasVerifiedToken) {
    // console.log("User is not authenticated, redirecting to login.");
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    searchParams.set("next", nextUrl.pathname);

    return NextResponse.redirect(
      new URL(`/${locale}/login?${searchParams}`, request.url)
    );
  }

  // console.log("No redirection, proceeding to next middleware.");

  // Dil çevirisi middleware'ini çağır
  return I18nMiddleware(request);
}

// Middleware yapılandırmasını yapın
export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",
    "/",
    "/[locale]/:path*",
  ],
};
