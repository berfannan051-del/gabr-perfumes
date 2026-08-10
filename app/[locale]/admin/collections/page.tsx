import { getCollections } from "@/lib/data/collections";
import { CollectionsManager } from "@/components/admin/collections-manager";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();
  return <CollectionsManager collections={collections} />;
}
