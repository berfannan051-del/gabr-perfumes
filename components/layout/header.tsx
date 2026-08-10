"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { SearchIcon, HeartIcon, BagIcon, MenuIcon, CloseIcon, UserIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const t = useTranslations("Nav");
  const ta = useTranslations("Auth");
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const cart = useCart();
  const wishlist = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  const transparent = isHome && !scrolled && !mobileOpen;

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
        transparent ? "bg-transparent" : "border-b border-border bg-surface/95 backdrop-blur-sm"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-24 max-w-7xl items-center justify-between px-6 transition-colors duration-500 md:px-12",
          transparent ? "text-background" : "text-foreground"
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
          <LogoMark className={cn(!transparent && "text-primary")} />
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
