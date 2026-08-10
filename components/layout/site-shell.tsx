"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { CartProvider } from "@/lib/cart/cart-context";
import { WishlistProvider } from "@/lib/wishlist/wishlist-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchOverlay } from "@/components/layout/search-overlay";
import type { Product } from "@/types/catalog";

export function SiteShell({
  children,
  products,
  session,
}: {
  children: React.ReactNode;
  products: Product[];
  session: Session | null;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <WishlistProvider>
          <Header onOpenSearch={() => setSearchOpen(true)} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} products={products} />
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
