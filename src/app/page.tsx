import { getWebData } from "@/lib/content";
import { MainPageClient } from "@/components/MainPageClient";

export const revalidate = 3600; // Revalidación ISR cada hora o instantánea bajo demanda mediante webhook

export default async function Home() {
  const data = await getWebData();

  return <MainPageClient data={data} />;
}
