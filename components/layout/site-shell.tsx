"use client";

import { useState } from "react";
import { CartProvider } from "@/lib/cart/cart-context";
import { WishlistProvider } from "@/lib/wishlist/wishlist-context";
import { Header } from "@/components/layout/header";
import { Footer, type FooterContent } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchOverlay } from "@/components/layout/search-overlay";
import type { Product } from "@/types/catalog";

export function SiteShell({
  children,
  products,
  footerContent,
}: {
  children: React.ReactNode;
  products: Product[];
  footerContent?: Partial<FooterContent>;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <CartProvider>
      <WishlistProvider>
        <Header onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1">{children}</main>
        <Footer content={footerContent} />
        <CartDrawer />
        <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} products={products} />
      </WishlistProvider>
    </CartProvider>
  );
}
