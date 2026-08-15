"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { SearchIcon, HeartIcon, BagIcon, MenuIcon, CloseIcon, UserIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function Header({
  onOpenSearch,
  promoText,
  logoUrl,
}: {
  onOpenSearch: () => void;
  promoText?: string;
  logoUrl?: string;
}) {
  const t = useTranslations("Nav");
  const ta = useTranslations("Auth");
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const cart = useCart();
  const wishlist = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  // The full multi-row treatment (promo bar + centered logo + nav) only
  // makes sense floating over the homepage hero — every other page keeps
  // the compact single-row header so their fixed top-padding offsets
  // (pt-28, lg:top-32, etc.) never have to change.
  const rich = isHome && !scrolled && !mobileOpen;

  const links = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/collections", label: t("collections") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-500",
        rich ? "bg-transparent" : "border-b border-border bg-surface/95 backdrop-blur-sm"
      )}
    >
      {rich && promoText && !promoDismissed && (
        <div className="relative flex items-center justify-center gap-4 bg-foreground/50 px-6 py-2 text-caption text-background backdrop-blur-sm">
          <span>{promoText}</span>
          <button
            type="button"
            onClick={() => setPromoDismissed(true)}
            aria-label={t("close")}
            className="text-background/70 transition-colors hover:text-background"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {rich && (
        <div className="relative hidden text-background md:block">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/30 to-transparent" />

          <div className="relative">
            <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-10 py-3">
              <div className="flex justify-start">
                <LanguageSwitcher className="text-sm font-semibold uppercase tracking-[0.22em] transition-colors hover:text-primary-highlight" />
              </div>

              <Link href="/" className="flex justify-center" aria-label="GABR Perfumes">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="GABR Perfumes" className="h-32 w-auto object-contain md:h-40" />
                ) : (
                  <Logo size="lg" className="h-32 w-auto md:h-40" />
                )}
              </Link>

              <div className="flex items-center justify-end gap-6">
                <button type="button" onClick={onOpenSearch} aria-label={t("search")} className="transition-colors hover:text-primary-highlight">
                  <SearchIcon className="h-5 w-5" />
                </button>
                {session ? (
                  <>
                    {session.user.role === "ADMIN" && (
                      <Link href="/admin" className="text-sm font-semibold uppercase tracking-[0.22em] transition-colors hover:text-primary-highlight">
                        Admin
                      </Link>
                    )}
                    <Link href="/account" aria-label={ta("account")} className="transition-colors hover:text-primary-highlight">
                      <UserIcon className="h-5 w-5" />
                    </Link>
                  </>
                ) : (
                  <Link href="/login" aria-label={ta("loginTitle")} className="transition-colors hover:text-primary-highlight">
                    <UserIcon className="h-5 w-5" />
                  </Link>
                )}
                <Link href="/wishlist" aria-label={t("wishlist")} className="relative transition-colors hover:text-primary-highlight">
                  <HeartIcon className="h-5 w-5" />
                  {wishlist.productIds.length > 0 && (
                    <span className="absolute -end-2 -top-2 grid h-4 w-4 place-items-center bg-primary text-[0.6rem] text-background">
                      {wishlist.productIds.length}
                    </span>
                  )}
                </Link>
                <button type="button" onClick={cart.open} aria-label={t("cart")} className="relative transition-colors hover:text-primary-highlight">
                  <BagIcon className="h-5 w-5" />
                  {cart.count > 0 && (
                    <span className="absolute -end-2 -top-2 grid h-4 w-4 place-items-center bg-primary text-[0.6rem] text-background">
                      {cart.count}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <nav className="flex items-center justify-center gap-10 py-4">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-base font-semibold uppercase tracking-[0.22em] transition-colors hover:text-primary-highlight">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div
        className={cn(
          "mx-auto flex h-24 max-w-7xl items-center justify-between px-6 transition-colors duration-500 md:px-12",
          rich && "md:hidden",
          rich ? "text-background" : "text-foreground"
        )}
      >
        <button
          type="button"
          className="grid h-10 w-10 place-items-center md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={t("menu")}
        >
          {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        <nav className="hidden items-center gap-10 lg:gap-12 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-label hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex-shrink-0" aria-label="GABR Perfumes">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="GABR Perfumes" className="h-16 w-auto object-contain" />
          ) : (
            <Logo size="sm" className="h-16" />
          )}
        </Link>

        <div className="flex items-center gap-5 md:gap-7">
          <LanguageSwitcher className="hidden text-label hover:text-primary transition-colors md:block" />
          <button type="button" onClick={onOpenSearch} aria-label={t("search")} className="hover:text-primary transition-colors">
            <SearchIcon className="h-5 w-5" />
          </button>
          {session ? (
            <div className="hidden items-center gap-5 md:flex">
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="text-label hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/account" aria-label={ta("account")} className="hover:text-primary transition-colors">
                <UserIcon className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <Link href="/login" aria-label={ta("loginTitle")} className="hidden hover:text-primary transition-colors md:block">
              <UserIcon className="h-5 w-5" />
            </Link>
          )}
          <Link href="/wishlist" aria-label={t("wishlist")} className="relative hover:text-primary transition-colors">
            <HeartIcon className="h-5 w-5" />
            {wishlist.productIds.length > 0 && (
              <span className="absolute -end-2 -top-2 grid h-4 w-4 place-items-center bg-primary text-[0.6rem] text-background">
                {wishlist.productIds.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={cart.open}
            aria-label={t("cart")}
            className="relative hover:text-primary transition-colors"
          >
            <BagIcon className="h-5 w-5" />
            {cart.count > 0 && (
              <span className="absolute -end-2 -top-2 grid h-4 w-4 place-items-center bg-primary text-[0.6rem] text-background">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-surface text-foreground md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2.5 text-body hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link href="/account" className="py-2.5 text-body hover:text-primary transition-colors">
                    {ta("account")}
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="py-2.5 text-body hover:text-primary transition-colors">
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="py-2.5 text-start text-body hover:text-primary transition-colors"
                  >
                    {ta("logout")}
                  </button>
                </>
              ) : (
                <Link href="/login" className="py-2.5 text-body hover:text-primary transition-colors">
                  {ta("loginTitle")}
                </Link>
              )}
              <LanguageSwitcher className="py-2.5 text-start text-label hover:text-primary transition-colors" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
