import { NextResponse } from "next/server";
import { getWebData } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getWebData();
    const prods = data.products || [];
    return NextResponse.json({
      productsCount: prods.length,
      productNames: prods.map((p) => p.name),
      isDefault: prods.length === 8 && prods[0]?.name.includes("Lavanda"),
      sectionsCount: data.sections?.length || 0,
      env: {
        hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        sheetId: process.env.GOOGLE_SHEET_ID ? `${process.env.GOOGLE_SHEET_ID.substring(0, 8)}...` : null,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
