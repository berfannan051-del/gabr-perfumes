"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BottleArt } from "@/components/product/bottle-art";
import { CloseIcon } from "@/components/ui/icons";
import type { Product } from "@/types/catalog";

const generatedViews = [
  { key: "front", transform: "scale(1) rotate(0deg)" },
  { key: "angle", transform: "scale(1.08) rotate(-4deg)" },
  { key: "macro", transform: "scale(1.6) translateY(6%) rotate(0deg)" },
] as const;

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasPhotos = product.images.length > 0;
  const thumbCount = hasPhotos ? product.images.length : generatedViews.length;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row-reverse sm:gap-5">
        <div
          className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden bg-surface-muted"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: zoomed ? 1.6 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.4 }, scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              style={{
                transformOrigin: origin,
                ...(hasPhotos ? undefined : { transform: generatedViews[active].transform }),
              }}
              className="h-full w-full"
            >
              {hasPhotos ? (
                <Image
                  src={product.images[active]}
                  alt={product.name.ar}
                  fill
                  priority
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4"
                />
              ) : (
                <BottleArt shape={product.bottleShape} liquidColor={product.heroColor} className="h-full w-full" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-3 sm:flex-col">
          {Array.from({ length: thumbCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-surface-muted transition-opacity sm:w-20 ${
                active === i ? "opacity-100 ring-1 ring-primary" : "opacity-50 hover:opacity-80"
              }`}
            >
              {hasPhotos ? (
                <Image src={product.images[i]} alt="" fill sizes="80px" className="object-contain p-1.5" />
              ) : (
                <div style={{ transform: generatedViews[i].transform }} className="h-full w-full">
                  <BottleArt shape={product.bottleShape} liquidColor={product.heroColor} className="h-full w-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-6"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute end-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-background/30 text-background transition-colors hover:bg-background/10"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[80vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {hasPhotos ? (
                <Image
                  src={product.images[active]}
                  alt={product.name.ar}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              ) : (
                <BottleArt shape={product.bottleShape} liquidColor={product.heroColor} className="h-full w-full" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
