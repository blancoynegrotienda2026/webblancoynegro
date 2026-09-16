import { NextResponse } from "next/server";
import { getWebData } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let directFetchStatus = null;
    let directFetchCount = 0;
    try {
      const res = await fetch("https://8jpivd50e95ayxtx.public.blob.vercel-storage.com/data/catalog.json", { cache: "no-store" });
      directFetchStatus = res.status;
      if (res.ok) {
        const json = await res.json();
        directFetchCount = (json.productos || json.products || []).length;
      }
    } catch (e: any) {
      directFetchStatus = e.message;
    }

    const data = await getWebData();
    const prods = data.products || [];
    return NextResponse.json({
      directFetchStatus,
      directFetchCount,
      productsCount: prods.length,
      productNames: prods.map((p) => p.name),
      isDefault: prods.length === 8 && prods[0]?.name.includes("Lavanda"),
      hasReiki: prods.some((p) => p.name.includes("Reiki 1")),
      sectionsCount: data.sections?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
