import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      total,
      deliveryType,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      clientCity,
      clientPostalCode,
      paymentMethod,
      notes,
    } = body;

    // Validación básica
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "La cesta está vacía" },
        { status: 400 }
      );
    }

    if (!clientName || !clientEmail || !clientPhone) {
      return NextResponse.json(
        { success: false, message: "Faltan datos de contacto obligatorios" },
        { status: 400 }
      );
    }

    // Generar identificador de pedido único profesional
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `BYN-${randomSuffix}`;
    const orderDate = new Date().toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
      dateStyle: "medium",
      timeStyle: "short",
    });

    console.log("=== NUEVO PEDIDO RECIBIDO (Opción 2) ===", {
      orderId,
      orderDate,
      clientName,
      clientEmail,
      clientPhone,
      deliveryType,
      paymentMethod,
      clientAddress,
      clientCity,
      clientPostalCode,
      notes,
      total,
      itemsCount: items.length,
    });

    // En el futuro, si se configura RESEND_API_KEY o similar, se puede enviar el email aquí:
    // if (process.env.RESEND_API_KEY) { await resend.emails.send(...) }

    return NextResponse.json({
      success: true,
      orderId,
      orderDate,
      message: "Pedido registrado con éxito",
    });
  } catch (error) {
    console.error("Error al procesar el pedido:", error);
    return NextResponse.json(
      { success: false, message: "Error interno al procesar el pedido" },
      { status: 500 }
    );
  }
}
