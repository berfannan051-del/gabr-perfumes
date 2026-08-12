"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { StarIcon } from "@/components/ui/icons";
import type { Locale } from "@/types/catalog";

type ReviewItem = {
  id: string;
  customerName: string;
  rating: number;
  textAr: string;
  textEn: string;
  customerImage: string | null;
};

export function ReviewsSection({ reviews }: { reviews: ReviewItem[] }) {
  const t = useTranslations("Reviews");
  const locale = useLocale() as Locale;

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-14 text-center">
          <span className="text-label text-primary">{t("eyebrow")}</span>
          <h2 className="text-h1 mt-4">{t("title")}</h2>
        </div>

        <div className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="shadow-soft w-[85vw] max-w-sm shrink-0 snap-start border border-border bg-surface p-8 transition-shadow duration-300 hover:shadow-lifted md:w-auto"
            >
              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <StarIcon key={s} filled={s < review.rating} className="h-4 w-4 text-primary" />
                ))}
              </div>

              <p
                className="text-h3 mb-8 min-h-24 text-muted-foreground"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}
              >
                “{locale === "ar" ? review.textAr : review.textEn}”
              </p>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                  {review.customerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={review.customerImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-label text-primary">
                      {review.customerName.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-label">{review.customerName}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
