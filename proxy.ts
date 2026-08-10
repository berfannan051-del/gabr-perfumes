import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function localeFromPath(pathname: string) {
  const locale = routing.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  return locale ?? routing.defaultLocale;
}

function stripLocale(pathname: string, locale: string) {
  return pathname.replace(new RegExp(`^/${locale}`), "") || "/";
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const locale = localeFromPath(pathname);
  const path = stripLocale(pathname, locale);

  const requiresAuth = path.startsWith("/account") || path.startsWith("/admin");
  const requiresAdmin = path.startsWith("/admin");

  if (requiresAuth) {
    if (!req.auth) {
      const loginUrl = new URL(`/${locale}/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (requiresAdmin && req.auth.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
