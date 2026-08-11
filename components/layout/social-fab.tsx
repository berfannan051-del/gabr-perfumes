"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon, PlusIcon } from "@/components/ui/icons";

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  whatsapp?: string;
};

export function SocialFab({ links }: { links: SocialLinks }) {
  const [open, setOpen] = useState(false);

  const items = (
    [
      { key: "instagram", href: links.instagram, icon: InstagramIcon },
      { key: "facebook", href: links.facebook, icon: FacebookIcon },
      { key: "tiktok", href: links.tiktok, icon: TikTokIcon },
      {
        key: "whatsapp",
        href: links.whatsapp ? `https://wa.me/${links.whatsapp.replace(/\D/g, "")}` : undefined,
        icon: WhatsAppIcon,
      },
    ] as const
  ).filter((i): i is (typeof i) & { href: string } => Boolean(i.href));

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 start-6 z-50 flex flex-col items-center gap-3">
      <AnimatePresence>
        {open &&
          items.map((item, i) => (
            <motion.a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.6 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="grid h-11 w-11 place-items-center rounded-full border border-primary bg-surface text-foreground shadow-lifted transition-colors hover:bg-primary hover:text-background"
            >
              <item.icon className="h-5 w-5" />
            </motion.a>
          ))}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        aria-label="social links"
        aria-expanded={open}
        className="grid h-14 w-14 place-items-center rounded-full bg-primary text-background shadow-lifted"
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <PlusIcon className="h-5 w-5" />
        </motion.span>
      </motion.button>
    </div>
  );
}
