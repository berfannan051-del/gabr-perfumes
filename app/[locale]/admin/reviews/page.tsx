import { prisma } from "@/lib/prisma";
import { ReviewsManager, type ReviewRow } from "@/components/admin/reviews-manager";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });

  const rows: ReviewRow[] = reviews.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    rating: r.rating,
    textAr: r.textAr,
    textEn: r.textEn,
    customerImage: r.customerImage,
    isActive: r.isActive,
  }));

  return <ReviewsManager reviews={rows} />;
}
