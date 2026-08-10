"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottleArt } from "@/components/product/bottle-art";
import type { Product } from "@/types/catalog";

const views = [
  { key: "front", transform: "scale(1) rotate(0deg)" },
  { key: "angle", transform: "scale(1.08) rotate(-4deg)" },
  { key: "macro", transform: "scale(1.6) translateY(6%) rotate(0deg)" },
] as const;

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row-reverse sm:gap-5">
      <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-surface-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transform: views[active].transform }}
            className="h-full w-full"
          >
            <BottleArt shape={product.bottleShape} liquidColor={product.heroColor} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3 sm:flex-col">
        {views.map((view, i) => (
          <button
            key={view.key}
            type="button"
            onClick={() => setActive(i)}
            className={`aspect-[3/4] w-16 shrink-0 overflow-hidden bg-surface-muted transition-opacity sm:w-20 ${
              active === i ? "opacity-100 ring-1 ring-primary" : "opacity-50 hover:opacity-80"
            }`}
          >
            <div style={{ transform: view.transform }} className="h-full w-full">
              <BottleArt shape={product.bottleShape} liquidColor={product.heroColor} className="h-full w-full" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
