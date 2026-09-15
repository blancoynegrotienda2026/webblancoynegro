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
 * Carga los datos de la web.
 * Si GOOGLE_SHEET_ID está configurado, intenta sincronizar con las pestañas de Google Sheets.
 * Si no está disponible o falla la red, recurre de forma transparente a defaultWebData.
 */
export async function getWebData(): Promise<WebData> {
  const sheetId = process.env.GOOGLE_SHEET_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

  if (!sheetId) {
    return defaultWebData;
  }

  try {
    const fetchSheetTab = async (tabName: string) => {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
      const res = await fetch(url, {
        next: { revalidate: 3600, tags: ["google-sheet-data"] },
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
          if (key === "ciudad" || key === "city") updatedData.config.city = val;
          if (key === "horario" || key === "schedule") updatedData.config.schedule = val;
        }
      });
    }

    // 1. Terapias
    if (terapiasRows.status === "fulfilled" && terapiasRows.value.length > 0) {
      const customTherapies: Therapy[] = terapiasRows.value.map((row, idx) => {
        const id = row["id"] || `terapia-${idx + 1}`;
        const title = row["titulo"] || row["title"] || defaultWebData.therapies[0].title;
        const category = (row["categoria"] || "quiromasaje") as Therapy["category"];
        const rawImg = row["imagen"] || row["foto"] || row["imageurl"] || "";

        return {
          id,
          title,
          subtitle: row["subtitulo"] || row["subtitle"] || "",
          category,
          categoryLabel: row["etiqueta"] || "Terapia Holística",
          shortDescription: row["descripcioncorta"] || row["shortdescription"] || "",
          fullDescription: row["descripcioncompleta"] || row["fulldescription"] || "",
          benefits: (row["beneficios"] || "").split(";").map((b) => b.trim()).filter(Boolean),
          duration: row["duracion"] || "60 minutos",
          priceNote: row["precio"] || "Consultar",
          imageUrl: formatImageUrl(rawImg, defaultWebData.therapies[0].imageUrl),
          badge: row["destacado"] || undefined,
        };
      });
      if (customTherapies.length > 0) {
        updatedData.therapies = customTherapies;
      }
    }

    // 2. Talleres
    if (talleresRows.status === "fulfilled" && talleresRows.value.length > 0) {
      const customWorkshops: Workshop[] = talleresRows.value.map((row, idx) => {
        const rawImg = row["imagen"] || row["foto"] || "";
        return {
          id: row["id"] || `taller-${idx + 1}`,
          title: row["titulo"] || "Taller Holístico",
          subtitle: row["subtitulo"] || "",
          date: row["fecha"] || "Próximamente",
          time: row["horario"] || "Consultar",
          modality: (row["modalidad"] as Workshop["modality"]) || "Presencial",
          spots: row["plazas"] || "Plazas limitadas",
          description: row["descripcion"] || "",
          includes: (row["incluye"] || "").split(";").map((i) => i.trim()).filter(Boolean),
          imageUrl: formatImageUrl(rawImg, defaultWebData.workshops[0].imageUrl),
        };
      });
      if (customWorkshops.length > 0) {
        updatedData.workshops = customWorkshops;
      }
    }

    // 3. Armonización
    if (armonizacionRows.status === "fulfilled" && armonizacionRows.value.length > 0) {
      const customHarmonization: HarmonizationItem[] = armonizacionRows.value.map((row, idx) => {
        const rawImg = row["imagen"] || row["foto"] || "";
        return {
          id: row["id"] || `armonizacion-${idx + 1}`,
          title: row["titulo"] || "Elemento de Armonización",
          category: (row["categoria"] as HarmonizationItem["category"]) || "minerales",
          categoryLabel: row["etiqueta"] || "Armonización",
          description: row["descripcion"] || "",
          properties: (row["propiedades"] || "").split(";").map((p) => p.trim()).filter(Boolean),
          usageTip: row["consejo"] || "",
          imageUrl: formatImageUrl(rawImg, defaultWebData.harmonization[0].imageUrl),
        };
      });
      if (customHarmonization.length > 0) {
        updatedData.harmonization = customHarmonization;
      }
    }

    // 4. Reseñas
    if (resenasRows.status === "fulfilled" && resenasRows.value.length > 0) {
      const customReviews: Review[] = resenasRows.value.map((row, idx) => ({
        id: row["id"] || `resena-${idx + 1}`,
        author: row["nombre"] || row["autor"] || "Cliente Satisfecho",
        service: row["servicio"] || "Terapia Holística",
        rating: Number(row["puntuacion"] || row["estrellas"]) || 5,
        text: row["comentario"] || row["texto"] || "",
        date: row["fecha"] || "Reciente",
        verified: true,
      }));
      if (customReviews.length > 0) {
        updatedData.reviews = customReviews;
      }
    }

    // 5. Productos con Estados de Agotado
    if (productosRows.status === "fulfilled" && productosRows.value.length > 0) {
      const parsedProducts: ShopProduct[] = [];
      for (let idx = 0; idx < productosRows.value.length; idx++) {
        const row = productosRows.value[idx];
        const rawImg = row["imagen"] || row["foto"] || "";
        const priceNum = parseFloat(row["precio"]?.replace(",", ".") || "0") || 15.0;
        const origPriceNum = row["precioanterior"] ? parseFloat(row["precioanterior"]?.replace(",", ".")) : undefined;
        const stockNum = parseInt(row["stockactual"] || row["stock"] || "10", 10);
        const accion = (row["accionagotado"] || row["agotado"] || "mostrar_agotado") as ShopProduct["accionAgotado"];
        const isExplicitNo = row["disponible"]?.toLowerCase() === "no" || row["stock"]?.toLowerCase() === "no";
        const inStock = !isExplicitNo && stockNum > 0;

        // Si está configurado para "ocultar" al agotarse y no hay stock, se descarta
        if (accion === "ocultar" && !inStock) {
          continue;
        }

        parsedProducts.push({
          id: row["id"] || `producto-${idx + 1}`,
          name: row["nombre"] || row["titulo"] || "Producto Holístico",
          category: (row["categoria"] as ShopProduct["category"]) || "aromaterapia",
          categoryLabel: row["etiqueta"] || "Holístico",
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
