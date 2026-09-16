import { WebData, Therapy, Workshop, HarmonizationItem, Review, ShopProduct } from "@/types/content";
import { defaultWebData } from "@/data/defaultContent";
import { formatImageUrl } from "@/lib/drive";

/**
 * Función sencilla para parsear CSV proveniente del endpoint público de Google Sheets:
 * https://docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}
 */
function parseCsvRows(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      const cleanKey = header.trim().toLowerCase().replace(/[\s_-]+/g, "");
      row[cleanKey] = values[index] ? values[index].trim() : "";
    });
    rows.push(row);
  }

  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Convierte un payload JSON recibido desde el TPV o Vercel Blob en una estructura WebData completa.
 */
function buildWebDataFromPayload(payload: any): WebData {
  const rawProds = payload.productos || payload.products || [];
  const parsedProducts: ShopProduct[] = rawProds.map((p: any, idx: number) => {
    const rawImg = p.imagenUrl || p.imageUrl || p.imagen || p.foto || "";
    const priceNum = typeof p.precioVenta === "number"
      ? p.precioVenta
      : (parseFloat(String(p.precioVenta || p.precio || "0").replace(",", ".")) || 0);
    const origPriceNum = p.precioAnterior || p.originalPrice ? parseFloat(String(p.precioAnterior || p.originalPrice).replace(",", ".")) : undefined;
    const stockNum = typeof p.stockActual === "number"
      ? p.stockActual
      : (parseInt(String(p.stockActual || p.stock || "0"), 10) || 0);
    const accion = (p.accionAgotado || p.agotado || "mostrar_agotado") as ShopProduct["accionAgotado"];
    const isPublicado = p.publicadoWeb !== false && String(p.publicadoWeb).toLowerCase() !== "false";
    const inStock = stockNum > 0;

    return {
      id: p.id || p._id || p.ref || `prod-${idx + 1}`,
      name: p.nombre || p.name || p.titulo || "Artículo Holístico",
      category: p.categoria || p.category || "aromaterapia",
      categoryLabel: p.categoriaLabel || p.categoryLabel || "Holístico",
      shortDescription: p.descripcionCorta || p.shortDescription || "",
      fullDescription: p.descripcionCompleta || p.fullDescription || p.descripcion || "",
      price: priceNum,
      originalPrice: origPriceNum,
      badge: p.destacado || p.badge || undefined,
      benefits: Array.isArray(p.beneficios || p.benefits)
        ? (p.beneficios || p.benefits)
        : (p.beneficios || "").split(";").map((b: string) => b.trim()).filter(Boolean),
      imageUrl: formatImageUrl(rawImg, "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"),
      inStock,
      stockActual: stockNum,
      accionAgotado: accion,
      publicadoWeb: isPublicado,
    };
  }).filter((p: any) => p.publicadoWeb && !(p.accionAgotado === "ocultar" && !p.inStock));

  const sections = (payload.secciones || payload.sections || defaultWebData.sections)
    .filter((s: any) => s.activo !== false)
    .sort((a: any, b: any) => (a.orden || 0) - (b.orden || 0));

  return {
    ...defaultWebData,
    config: {
      ...defaultWebData.config,
      ...(payload.config || {}),
    },
    products: parsedProducts.length > 0 ? parsedProducts : defaultWebData.products,
    sections: sections.length > 0 ? sections : defaultWebData.sections,
    therapies: payload.terapias || payload.therapies || defaultWebData.therapies,
    workshops: payload.talleres || payload.workshops || defaultWebData.workshops,
    harmonization: payload.armonizacion || payload.harmonization || defaultWebData.harmonization,
    reviews: payload.resenas || payload.reviews || defaultWebData.reviews,
  };
}

/**
 * Carga los datos de la web con redundancia triple:
 * 1. Catálogo instantáneo en Vercel Blob (directo desde el TPV al sincronizar).
 * 2. Hojas de Google Sheets vía CSV (si GOOGLE_SHEET_ID es un ID válido de hoja).
 * 3. Fallback transparente a datos por defecto.
 */
export async function getWebData(): Promise<WebData> {
  // ESTRATEGIA 1: Vercel Blob (Almacén instantáneo de catálogo sincronizado desde el TPV)
  try {
    const directRes = await fetch("https://8jpivd50e95ayxtx.public.blob.vercel-storage.com/data/catalog.json", {
      next: { revalidate: 30, tags: ["google-sheet-data"] },
    });
    if (directRes.ok) {
      const directJson = await directRes.json();
      if (directJson && (directJson.productos || directJson.products)) {
        return buildWebDataFromPayload(directJson);
      }
    }
  } catch (err) {
    // Fallback a list() de Blob o Google Sheets
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const result = await list({ prefix: "data/catalog.json", limit: 1 });
      if (result.blobs && result.blobs.length > 0) {
        const catalogBlob = result.blobs[0];
        const res = await fetch(catalogBlob.url, {
          next: { revalidate: 30, tags: ["google-sheet-data"] },
        });
        if (res.ok) {
          const blobJson = await res.json();
          if (blobJson && (blobJson.productos || blobJson.products)) {
            return buildWebDataFromPayload(blobJson);
          }
        }
      }
    } catch (blobErr) {
      console.warn("Aviso: no se pudo leer catálogo desde Vercel Blob:", blobErr);
    }
  }

  // ESTRATEGIA 2: Google Sheets CSV o Webhook
  const rawTarget = (process.env.GOOGLE_SHEET_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || process.env.APPS_SCRIPT_URL || "").trim();

  if (!rawTarget) {
    return defaultWebData;
  }

  const isAppsScript = rawTarget.includes("script.google.com") || rawTarget.startsWith("AKfycb");
  const appsScriptUrl = isAppsScript
    ? (rawTarget.startsWith("http") ? rawTarget : `https://script.google.com/macros/s/${rawTarget}/exec`)
    : null;

  try {
    // Si es Webhook Apps Script con soporte get_data
    if (appsScriptUrl) {
      try {
        const res = await fetch(`${appsScriptUrl}?action=get_data`, {
          next: { revalidate: 60, tags: ["google-sheet-data"] },
        });
        if (res.ok) {
          const json = await res.json();
          if (json && (json.productos || json.products || json.data)) {
            return buildWebDataFromPayload(json.data || json);
          }
        }
      } catch (scriptErr) {
        console.warn("Aviso Webhook Apps Script:", scriptErr);
      }
    }

    // Si es un ID real de Google Sheet (no un ID de script)
    const sheetId = isAppsScript ? "" : rawTarget;
    if (!sheetId) {
      return defaultWebData;
    }

    const fetchSheetTab = async (tabName: string) => {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
      const res = await fetch(url, {
        next: { revalidate: 60, tags: ["google-sheet-data"] },
      });
      if (!res.ok) throw new Error(`Error al leer pestaña ${tabName}: ${res.statusText}`);
      const text = await res.text();
      return parseCsvRows(text);
    };

    const [terapiasRows, talleresRows, armonizacionRows, resenasRows, productosRows, seccionesRows, configRows] = await Promise.allSettled([
      fetchSheetTab("Terapias"),
      fetchSheetTab("Talleres"),
      fetchSheetTab("Armonizacion"),
      fetchSheetTab("Reseñas"),
      fetchSheetTab("Productos"),
      fetchSheetTab("SeccionesWeb"),
      fetchSheetTab("Configuracion"),
    ]);

    const updatedData: WebData = {
      ...defaultWebData,
      config: { ...defaultWebData.config },
      chakras: defaultWebData.chakras,
    };

    // 0. Configuración Dinámica (Clave / Valor)
    if (configRows.status === "fulfilled" && configRows.value.length > 0) {
      configRows.value.forEach((row) => {
        const key = row["clave"] || row["key"] || "";
        const val = row["valor"] || row["val"] || row["value"] || "";
        if (key && val) {
          if (key === "nombrecomercial" || key === "nombre") updatedData.config.name = val;
          if (key === "tagline" || key === "lema") updatedData.config.tagline = val;
          if (key === "descripcion" || key === "description") updatedData.config.description = val;
          if (key === "biografia" || key === "bio") updatedData.config.therapistBio = val;
          if (key === "telefono" || key === "phone") {
            updatedData.config.phone = val;
            updatedData.config.phoneDisplay = val;
          }
          if (key === "whatsapp") updatedData.config.whatsapp = val.replace(/[^0-9]/g, "");
          if (key === "email") updatedData.config.email = val;
          if (key === "direccion" || key === "address") updatedData.config.address = val;
          if (key === "horario" || key === "schedule") updatedData.config.schedule = val;
        }
      });
    }

    // 1. Terapias
    if (terapiasRows.status === "fulfilled" && terapiasRows.value.length > 0) {
      const customTherapies: Therapy[] = [];
      for (let idx = 0; idx < terapiasRows.value.length; idx++) {
        const row = terapiasRows.value[idx];
        const rawImg = row["imagen"] || row["foto"] || "";
        customTherapies.push({
          id: row["id"] || `terapia-${idx + 1}`,
          title: row["titulo"] || "Terapia Holística",
          subtitle: row["subtitulo"] || "",
          category: (row["categoria"] as Therapy["category"]) || "quiromasaje",
          categoryLabel: row["etiqueta"] || "Bienestar",
          shortDescription: row["descripcioncorta"] || row["descripcion"] || "",
          fullDescription: row["descripcioncompleta"] || row["descripcion"] || "",
          benefits: (row["beneficios"] || "").split(";").map((b) => b.trim()).filter(Boolean),
          duration: row["duracion"] || "60 min",
          priceNote: row["precio"] ? `${row["precio"]} €` : undefined,
          badge: row["destacado"] || undefined,
          imageUrl: formatImageUrl(rawImg, "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"),
        });
      }
      if (customTherapies.length > 0) {
        updatedData.therapies = customTherapies;
      }
    }

    // 2. Talleres
    if (talleresRows.status === "fulfilled" && talleresRows.value.length > 0) {
      const customWorkshops: Workshop[] = [];
      for (let idx = 0; idx < talleresRows.value.length; idx++) {
        const row = talleresRows.value[idx];
        const rawImg = row["imagen"] || row["foto"] || "";
        customWorkshops.push({
          id: row["id"] || `taller-${idx + 1}`,
          title: row["titulo"] || "Taller Vivencial",
          subtitle: row["subtitulo"] || "",
          date: row["fecha"] || "Próximamente",
          time: row["hora"] || "17:00 - 20:00",
          modality: (row["modalidad"] as Workshop["modality"]) || "Presencial",
          spots: row["plazas"] || "Plazas reducidas",
          description: row["descripcion"] || "",
          includes: (row["incluye"] || "").split(";").map((i) => i.trim()).filter(Boolean),
          imageUrl: formatImageUrl(rawImg, "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"),
        });
      }
      if (customWorkshops.length > 0) {
        updatedData.workshops = customWorkshops;
      }
    }

    // 3. Armonización
    if (armonizacionRows.status === "fulfilled" && armonizacionRows.value.length > 0) {
      const customHarm: HarmonizationItem[] = [];
      for (let idx = 0; idx < armonizacionRows.value.length; idx++) {
        const row = armonizacionRows.value[idx];
        const rawImg = row["imagen"] || row["foto"] || "";
        customHarm.push({
          id: row["id"] || `armonizacion-${idx + 1}`,
          title: row["titulo"] || "Elemento Sagrado",
          category: (row["categoria"] as HarmonizationItem["category"]) || "aromaterapia",
          categoryLabel: row["etiqueta"] || "Armonía",
          description: row["descripcion"] || "",
          properties: (row["propiedades"] || "").split(";").map((p) => p.trim()).filter(Boolean),
          usageTip: row["consejouso"] || row["consejo"] || "",
          imageUrl: formatImageUrl(rawImg, "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"),
        });
      }
      if (customHarm.length > 0) {
        updatedData.harmonization = customHarm;
      }
    }

    // 4. Reseñas
    if (resenasRows.status === "fulfilled" && resenasRows.value.length > 0) {
      const customReviews: Review[] = [];
      for (let idx = 0; idx < resenasRows.value.length; idx++) {
        const row = resenasRows.value[idx];
        customReviews.push({
          id: row["id"] || `review-${idx + 1}`,
          author: row["autor"] || "Cliente",
          service: row["servicio"] || "Sesión de Bienestar",
          rating: parseInt(row["estrellas"] || row["rating"] || "5", 10) || 5,
          text: row["comentario"] || row["texto"] || "",
          date: row["fecha"] || "Reciente",
          verified: row["verificado"]?.toLowerCase() !== "false" && row["verificado"]?.toLowerCase() !== "no",
        });
      }
      if (customReviews.length > 0) {
        updatedData.reviews = customReviews;
      }
    }

    // 5. Productos con Estados de Agotado y soporte total a columnas TPV
    if (productosRows.status === "fulfilled" && productosRows.value.length > 0) {
      const parsedProducts: ShopProduct[] = [];
      for (let idx = 0; idx < productosRows.value.length; idx++) {
        const row = productosRows.value[idx];
        const rawImg = row["imagenurl"] || row["imagen"] || row["foto"] || "";
        const priceNum = parseFloat(row["precioventa"]?.replace(",", ".") || row["precio"]?.replace(",", ".") || "0") || 0;
        const origPriceNum = row["precioanterior"] ? parseFloat(row["precioanterior"]?.replace(",", ".")) : undefined;
        const stockNum = parseInt(row["stockactual"] || row["stock"] || "0", 10);
        const accion = (row["accionagotado"] || row["agotado"] || "mostrar_agotado") as ShopProduct["accionAgotado"];
        const isPublicado = row["publicadoweb"] ? (row["publicadoweb"].toLowerCase() === "true" || row["publicadoweb"] === "1" || row["publicadoweb"].toLowerCase() === "si") : true;

        if (!isPublicado) continue;

        const isExplicitNo = row["disponible"]?.toLowerCase() === "no" || row["stock"]?.toLowerCase() === "no";
        const inStock = !isExplicitNo && stockNum > 0;

        if (accion === "ocultar" && !inStock) {
          continue;
        }

        parsedProducts.push({
          id: row["id"] || row["ref"] || `producto-${idx + 1}`,
          name: row["nombre"] || row["titulo"] || "Producto Holístico",
          category: (row["categoria"] as ShopProduct["category"]) || "aromaterapia",
          categoryLabel: row["categorialabel"] || row["etiqueta"] || "Holístico",
          shortDescription: row["descripcioncorta"] || "",
          fullDescription: row["descripcioncompleta"] || row["descripcion"] || "",
          price: priceNum,
          originalPrice: origPriceNum,
          badge: row["destacado"] || undefined,
          benefits: (row["beneficios"] || "").split(";").map((b) => b.trim()).filter(Boolean),
          imageUrl: formatImageUrl(rawImg, "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"),
          inStock,
          stockActual: stockNum,
          accionAgotado: accion,
        });
      }

      if (parsedProducts.length > 0) {
        updatedData.products = parsedProducts;
      }
    }

    // 6. Secciones Web Dinámicas
    if (seccionesRows.status === "fulfilled" && seccionesRows.value.length > 0) {
      const dynamicSections = seccionesRows.value
        .map((row, idx) => ({
          id: row["id"] || `sec-${idx + 1}`,
          orden: parseInt(row["orden"] || String(idx + 1), 10) || idx + 1,
          tipoPlantilla: row["tipoplantilla"] || row["tipo"] || "texto_foto",
          titulo: row["titulo"] || "Sección",
          subtitulo: row["subtitulo"] || "",
          activo: row["activo"]?.toLowerCase() !== "false" && row["activo"]?.toLowerCase() !== "no",
        }))
        .filter((s) => s.activo)
        .sort((a, b) => a.orden - b.orden);

      if (dynamicSections.length > 0) {
        updatedData.sections = dynamicSections;
      }
    }

    return updatedData;
  } catch (error) {
    console.warn("No se pudo sincronizar con Google Sheets, usando datos por defecto:", error);
    return defaultWebData;
  }
}
