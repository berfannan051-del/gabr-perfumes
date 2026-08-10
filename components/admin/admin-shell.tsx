"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Link, usePathname } from "@/i18n/navigation";
import { ToastProvider } from "@/components/admin/ui/toast";
import {
  GridIcon,
  BoxIcon,
  BagIcon,
  UsersIcon,
  StarIcon,
  ImageIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
  LogoutIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };

const ICON_BY_HREF: Record<string, React.ComponentType<{ className?: string }>> = {
  "/admin": GridIcon,
  "/admin/products": BoxIcon,
  "/admin/collections": GridIcon,
  "/admin/orders": BagIcon,
  "/admin/customers": UsersIcon,
  "/admin/reviews": StarIcon,
  "/admin/content": ImageIcon,
  "/admin/settings": SettingsIcon,
};

export function AdminShell({
  children,
  nav,
  adminName,
  title,
  backToSiteLabel,
  logoutLabel,
}: {
  children: React.ReactNode;
  nav: NavGroup[];
  adminName: string;
  title: string;
  backToSiteLabel: string;
  logoutLabel: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel =
    nav.flatMap((g) => g.items).find((item) => pathname === item.href)?.label ?? title;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface-muted">
        <div className="mx-auto flex max-w-[1600px]">
          {/* Sidebar */}
          <aside
            className={cn(
              "fixed inset-y-0 start-0 z-40 w-64 shrink-0 border-e border-border bg-surface transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0",
              mobileOpen ? "translate-x-0" : "rtl:translate-x-full -translate-x-full"
            )}
          >
            <div className="flex h-20 items-center justify-between border-b border-border px-6">
              <span
                className="text-primary"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                <span className="text-xl tracking-[0.18em]">GABR</span>
              </span>
              <button
                type="button"
                className="text-muted-foreground md:hidden"
                onClick={() => setMobileOpen(false)}
                aria-label="close"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 overflow-y-auto px-4 py-6" style={{ height: "calc(100% - 5rem)" }}>
              {nav.map((group) => (
                <div key={group.label}>
                  <p className="text-label mb-2 px-2 text-muted-foreground">{group.label}</p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const active = pathname === item.href;
                      const Icon = ICON_BY_HREF[item.href] ?? GridIcon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-body transition-colors",
                            active
                              ? "bg-primary text-background"
                              : "text-foreground hover:bg-surface-muted"
                          )}
                        >
                          <Icon className="h-4.5 w-4.5 shrink-0" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {mobileOpen && (
            <div
              className="fixed inset-0 z-30 bg-foreground/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}

          {/* Main */}
          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur-sm md:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-foreground md:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
                <h1 className="text-h3 text-lg">{activeLabel}</h1>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-caption hidden text-muted-foreground hover:text-primary sm:block">
                  {backToSiteLabel}
                </Link>
                <span className="text-caption hidden sm:block">{adminName}</span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  aria-label={logoutLabel}
                  className="grid h-9 w-9 place-items-center border border-border text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <LogoutIcon className="h-4 w-4" />
                </button>
              </div>
            </header>

            <main className="p-5 md:p-8">{children}</main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
