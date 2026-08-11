import { getAllBrands } from "@/lib/data/brands";
import { BrandsManager } from "@/components/admin/brands-manager";

export default async function AdminBrandsPage() {
  const brands = await getAllBrands();
  return <BrandsManager brands={brands} />;
}
