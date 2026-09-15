import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}

async function handleRevalidate(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET || "aura-pepi-secret-key";

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Token de seguridad no válido" }, { status: 401 });
  }

  try {
    revalidatePath("/");
    revalidateTag("google-sheet-data", "default");
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: "¡Caché revalidada con éxito! Los últimos cambios de Google Sheets ya están visibles.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error desconocido al revalidar";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
