import { getWebData } from "@/lib/content";
import { MainPageClient } from "@/components/MainPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const data = await getWebData();

  return <MainPageClient data={data} />;
}
