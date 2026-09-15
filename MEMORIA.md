# Memoria Técnica y Funcional del Proyecto: Blanco y Negro - Terapias Holísticas y Bienestar

**Proyecto:** Blanco y Negro - Terapias Holísticas y Bienestar  
**Ubicación Física:** Boiro (A Coruña, Galicia)  
**Terapeuta y Responsable:** Pepi  
**Repositorio GitHub:** [https://github.com/aalcaide45cy/webpepireiki.git](https://github.com/aalcaide45cy/webpepireiki.git)  
**Hosting y Despliegue:** Vercel (CI/CD automático desde la rama `main`)  
**Ecosistema Base de Datos y Backend:** Google Sheets + Google Apps Script (0€/mes de coste fijo)  
**Fecha de Actualización:** Septiembre 2026  

---

## 1. Resumen Ejecutivo y Enfoque del Proyecto

El proyecto consiste en el diseño, desarrollo y despliegue de una plataforma web profesional para el centro **Blanco y Negro** en Boiro. El centro combina terapias holísticas presenciales (**quiromasaje terapéutico, Reiki Usui, lecturas de Registros Akáshicos y respiración consciente**), talleres y charlas formativas, y una **tienda online** de autocuidado con productos botánicos, minerales y herramientas de armonización.

### Principios Fundamentales de la Arquitectura:
1. **Google Sheets como Base de Datos Central:** No requiere bases de datos tradicionales (MySQL, PostgreSQL o MongoDB). Toda la información se gestiona desde una única hoja de cálculo de Google Drive dividida en **3 pestañas clave**.
2. **Cero Costes de Mantenimiento (0€/mes para siempre):** Sin cuotas de servidores, sin suscripciones a Shopify ($39/mes) ni pasarelas de pago de alta costosa.
3. **Flujo de Compra Integrado y Serio (Opción 2):** Se descarta el uso de enlaces automáticos de WhatsApp (`wa.me`) por ser informales e inestables en escritorio, sustituyéndolo por un formulario de pedido en 2 pasos dentro de la web con código oficial de pedido (`#BYN-XXXX`), instrucciones de Bizum en pantalla y recogida física en la tienda de Boiro.
4. **Notificaciones Automáticas por Email:** Mediante un script nativo de Google Sheets, cada pedido dispara automáticamente un correo de comanda a `pedidos@pepi.com` y una copia formal de recibo al cliente.

---

## 2. Identidad Visual de Marca y Experiencia de Usuario

### 2.1. Logotipo y Recursos de Marca Propios
A partir de la ilustración aportada por la clienta, se han vectorizado y optimizado quirúrgicamente dos recursos esenciales:
- **Símbolo Yin-Yang Circular (`/brand/yinyang.webp` y `/brand/yinyang.png`):**
  - Mantiene la textura orgánica de trazo oriental al carboncillo.
  - Implementado en favicon oficial (`favicon.ico`, `icon.svg`, `icon.png`), cabecera de navegación (`Navbar.tsx`), asistente de reservas (`BookingModal.tsx`) y pie de página (`Footer.tsx`).
- **Cañas y Follaje de Bambú Zen (`/brand/bamboo-left.webp` y `/brand/bamboo-right.webp`):**
  - Cañas con transparencia alfa pura fijadas a los laterales de toda la web a `z-0` para sumergir al visitante en un ambiente de calma y naturaleza.

### 2.2. Paleta de Colores Zen
- **Fondo base:** Crema orgánico y relajante (`#fbf9f5`).
- **Verde bosque terapéutico:** (`#3d5a4c` y `#2d473b`).
- **Dorado arena y bambú:** (`#dfc89f` y `#b5935b`).
- **Tipografías:** *Plus Jakarta Sans* (lectura limpia en pantallas) combinada con *Playfair Display* (elegancia editorial en titulares).

---

## 3. Google Sheets como Base de Datos Central: Las 3 Pestañas

Toda la web se alimenta de un único archivo de Google Sheets alojado en el Google Drive del negocio. La hoja se organiza en **3 pestañas claramente diferenciadas**:

```
Google Sheets: "Web Blanco y Negro - Base de Datos"
 ├── Pestaña 1: Textos Web       (Control de contenidos y bloques de la web)
 ├── Pestaña 2: Productos        (Catálogo de productos a la venta en tienda)
 └── Pestaña 3: Pedidos          (Historial de ventas, Bizum y comanda)
```

---

### PESTAÑA 1: `Textos Web` (Control Editorial sin Tocar Código)

Permite a Pepi o a su equipo cambiar cualquier texto, teléfono, horario o descripción de terapias sin depender de un programador.

#### Estructura de Columnas:
| Columna | Nombre | Descripción | Ejemplo de Valor |
|---|---|---|---|
| **A** | `Sección` | Identificador del bloque de la web | `Hero`, `Sobre Mi`, `Quiromasaje`, `Contacto` |
| **B** | `Clave` | Identificador único del texto | `titulo_principal`, `bio_pepi`, `horario`, `telefono` |
| **C** | `Texto` | El contenido que se muestra en la web | `Reconecta con tu equilibrio vital` |
| **D** | `Notas` | Guía de uso para Pepi | *Texto grande que aparece en la portada* |

#### Ejemplos de Filas en la Pestaña `Textos Web`:
- **Contacto:**
  - `Contacto` | `direccion` | `Boiro (A Coruña)` | *Ubicación de la tienda y terapias*
  - `Contacto` | `telefono` | `600 123 456` | *Teléfono público para llamadas y citas*
  - `Contacto` | `horario` | `Lunes a Viernes: 09:30 - 20:00 \| Sábados con cita previa` | *Horario de atención*
- **Presentación:**
  - `Sobre Mi` | `bio_pepi` | `Terapeuta holística y quiromasajista titulada en Boiro con más de una década acompañando procesos de sanación...` | *Biografía en la portada*
- **Terapias y Servicios:**
  - `Terapias` | `quiromasaje_desc` | `Técnicas manuales profundas para descontracturar espaldas cargadas y devolver movilidad al cuerpo...` | *Descripción en la carta*
  - `Terapias` | `reiki_desc` | `Canalización de energía vital universal para armonizar centros energéticos (chakras)...` | *Descripción en la carta*
  - `Terapias` | `akashicos_desc` | `Lecturas del libro del alma para resolver dudas existenciales y patrones repetitivos...` | *Descripción en la carta*

---

### PESTAÑA 2: `Productos` (Catálogo de la Tienda Holística)

Controla los productos que se muestran en la sección `/tienda`. Si Pepi añade una fila, el producto aparece automáticamente; si pone `No` en stock, se oculta o se marca como agotado.

#### Estructura de Columnas:
| Columna | Nombre | Tipo | Descripción |
|---|---|---|---|
| **A** | `id` | Texto | Identificador único (ej. `lavanda-bio-15ml`, `geoda-amatista`) |
| **B** | `nombre` | Texto | Nombre visible (ej. `Aceite Esencial Lavanda Vera Bio (15ml)`) |
| **C** | `categoria` | Selector | `aromaterapia`, `minerales`, `herramientas`, `armonizacion` |
| **D** | `etiqueta` | Texto | Etiqueta visible (ej. `Aromaterapia Pura`, `Minerales & Gemas`) |
| **E** | `descripcion_corta` | Texto | Resumen en 1 línea para la tarjeta de producto |
| **F** | `descripcion_completa`| Texto | Descripción detallada de propiedades holísticas |
| **G** | `precio` | Número | Precio actual en euros (ej. `16.50`) |
| **H** | `precio_anterior` | Número (Opcional) | Precio tachado para ofertas (ej. `19.00`) |
| **I** | `destacado` | Texto (Opcional) | Insignia: `Más Vendido`, `Esencial Zen`, `Pieza Única`, `Hecho a Mano` |
| **J** | `beneficios` | Texto | Puntos clave separados por punto y coma `;` (ej. `Calma el estrés; Induce el sueño profundo; 100% puro`) |
| **K** | `foto` | Enlace | Enlace compartido de la foto en **Google Drive** o URL externa |
| **L** | `stock` | Selector | `Sí` / `No` (permite pausar un producto sin borrarlo) |

---

### PESTAÑA 3: `Pedidos` (Registro de Ventas, Bizum y Control de Comandas)

Es la base de datos de pedidos de la tienda. Cada vez que un cliente pulsa **"Confirmar Pedido"** en la web, se inserta una nueva fila de forma automática y se dispara el sistema de emails.

#### Estructura de Columnas:
| Columna | Cabecera | Descripción | Ejemplo de Valor |
|---|---|---|---|
| **A** | `Fecha y Hora` | Timestamp exacto de la comanda | `05/09/2026, 17:45` |
| **B** | `ID Pedido` | Código único de control | `#BYN-8421` |
| **C** | `Cliente` | Nombre y apellidos del comprador | `Carmen Martínez González` |
| **D** | `Teléfono` | Móvil de contacto | `611 223 344` |
| **E** | `Email` | Correo electrónico del cliente | `carmen@ejemplo.com` |
| **F** | `Entrega` | Modalidad elegida | `Recogida en Tienda (Boiro)` o `Envío a Domicilio` |
| **G** | `Dirección Envío` | Domicilio completo si aplica | `Rúa Principal 12, 2ºA, 15930 Boiro` (o `Recogida en Tienda`) |
| **H** | `Método Pago` | Método acordado | `Bizum Directo` o `En Tienda (Efectivo/Tarjeta)` |
| **I** | `Productos` | Desglose de artículos y unidades | `1x Aceite Lavanda Bio (16.50€) + 1x Gua Sha Rosa (19.50€)` |
| **J** | `Total (€)` | Importe total a cobrar | `36.00 €` |
| **K** | `Estado Pedido` | Menú desplegable para Pepi | `Pendiente Bizum` / `Pagado` / `Preparado` / `Entregado` |
| **L** | `Notas` | Indicaciones especiales del comprador | *Por favor, empaquetar para regalo de cumpleaños.* |

---

## 4. Sistema Automatizado de Envío de Emails (Google Apps Script)

El envío de emails se realiza íntegramente desde la propia infraestructura de Google mediante un script en la hoja de cálculo. Esto garantiza **coste 0€**, **cero riesgo de caer en la carpeta de Spam** y **entrega instantánea**.

### 4.1. Código Completo para Google Apps Script (`doPost`)

Este código se copia y pega en la hoja de cálculo en el menú **Extensiones &rarr; Apps Script**:

```javascript
/**
 * SISTEMA INTEGRAL DE PEDIDOS Y NOTIFICACIÓN POR EMAIL
 * Blanco y Negro - Terapias Holísticas y Bienestar (Boiro)
 */

// CONFIGURACIÓN DEL NEGOCIO
const EMAIL_PEDIDOS = "pedidos@pepi.com"; // Buzón dedicado exclusivo para pedidos
const NOMBRE_NEGOCIO = "Blanco y Negro - Terapias Holísticas";
const TELEFONO_BIZUM = "600 123 456";
const DIRECCION_TIENDA = "Boiro (A Coruña)";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Obtener o crear la pestaña 'Pedidos'
    let sheet = ss.getSheetByName("Pedidos");
    if (!sheet) {
      sheet = ss.insertSheet("Pedidos");
      sheet.appendRow([
        "Fecha y Hora",
        "ID Pedido",
        "Cliente",
        "Teléfono",
        "Email",
        "Entrega",
        "Dirección Envío",
        "Método Pago",
        "Productos",
        "Total (€)",
        "Estado Pedido",
        "Notas"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#eaf0ec");
    }

    // 2. Formatear la lista de productos
    const productosTexto = (data.items || []).map(function(item) {
      return item.quantity + "x " + item.product.name + " (" + (item.product.price * item.quantity).toFixed(2) + "€)";
    }).join("\n");

    const productosHtml = (data.items || []).map(function(item) {
      return "<li><strong>" + item.quantity + "x</strong> " + item.product.name + " &mdash; <strong>" + (item.product.price * item.quantity).toFixed(2) + "€</strong></li>";
    }).join("");

    const direccionCompleta = data.deliveryType === "envio"
      ? (data.clientAddress + ", " + data.clientPostalCode + " " + data.clientCity)
      : "Recogida en Tienda (Boiro)";

    const metodoPagoTexto = data.paymentMethod === "bizum" ? "Bizum Directo" : "En Tienda (Efectivo/Tarjeta)";

    // 3. Añadir la fila en Google Sheets
    sheet.appendRow([
      data.orderDate || new Date().toLocaleString("es-ES"),
      data.orderId,
      data.clientName,
      data.clientPhone,
      data.clientEmail,
      data.deliveryType === "envio" ? "Envío a Domicilio" : "Recogida en Tienda (Boiro)",
      direccionCompleta,
      metodoPagoTexto,
      productosTexto,
      Number(data.total).toFixed(2) + " €",
      "Pendiente Bizum",
      data.notes || ""
    ]);

    // 4. EMAIL 1: Notificación Inmediata al Buzón de Pedidos de Pepi
    const asuntoPepi = "📦 Nuevo Pedido " + data.orderId + " - " + data.clientName + " (" + Number(data.total).toFixed(2) + "€)";
    const cuerpoPepiHtml = 
      "<div style='font-family: Arial, sans-serif; color: #212924; max-width: 600px; border: 1px solid #ece4d8; border-radius: 12px; padding: 24px; background: #ffffff;'>" +
        "<h2 style='color: #3d5a4c; margin-top: 0;'>🌿 ¡Nuevo Pedido Recibido!</h2>" +
        "<p>Se ha registrado una nueva comanda desde la tienda online:</p>" +
        "<div style='background: #fbf9f5; border: 1px solid #e0d8cc; padding: 16px; border-radius: 8px; margin-bottom: 20px;'>" +
          "<p style='margin: 4px 0;'><strong>Código de Pedido:</strong> <span style='font-family: monospace; font-size: 16px; color: #3d5a4c; font-weight: bold;'>" + data.orderId + "</span></p>" +
          "<p style='margin: 4px 0;'><strong>Cliente:</strong> " + data.clientName + "</p>" +
          "<p style='margin: 4px 0;'><strong>Teléfono:</strong> <a href='tel:" + data.clientPhone + "'>" + data.clientPhone + "</a></p>" +
          "<p style='margin: 4px 0;'><strong>Email:</strong> " + data.clientEmail + "</p>" +
          "<p style='margin: 4px 0;'><strong>Modalidad:</strong> " + (data.deliveryType === 'envio' ? 'Envío a Domicilio' : 'Recogida en Tienda (Boiro)') + "</p>" +
          (data.deliveryType === 'envio' ? "<p style='margin: 4px 0;'><strong>Dirección de Entrega:</strong> " + direccionCompleta + "</p>" : "") +
          "<p style='margin: 4px 0;'><strong>Forma de Pago:</strong> " + metodoPagoTexto + "</p>" +
          (data.notes ? "<p style='margin: 4px 0;'><strong>Notas del Cliente:</strong> " + data.notes + "</p>" : "") +
        "</div>" +
        "<h3 style='color: #3d5a4c; margin-bottom: 8px;'>Productos a preparar:</h3>" +
        "<ul style='line-height: 1.8;'>" + productosHtml + "</ul>" +
        "<div style='border-top: 2px solid #3d5a4c; padding-top: 12px; margin-top: 16px;'>" +
          "<p style='font-size: 18px; font-weight: bold; color: #212924; margin: 0;'>Total a cobrar: " + Number(data.total).toFixed(2) + " €</p>" +
        "</div>" +
      "</div>";

    MailApp.sendEmail({
      to: EMAIL_PEDIDOS,
      subject: asuntoPepi,
      htmlBody: cuerpoPepiHtml
    });

    // 5. EMAIL 2: Copia Formal de Confirmación al Cliente
    if (data.clientEmail) {
      const asuntoCliente = "Confirmación de tu pedido " + data.orderId + " - " + NOMBRE_NEGOCIO;
      const cuerpoClienteHtml = 
        "<div style='font-family: Arial, sans-serif; color: #212924; max-width: 600px; border: 1px solid #ece4d8; border-radius: 12px; padding: 24px; background: #ffffff;'>" +
          "<h2 style='color: #3d5a4c; margin-top: 0;'>🌿 Gracias por tu pedido, " + data.clientName + "</h2>" +
          "<p>Hemos registrado tu compra correctamente en <strong>" + NOMBRE_NEGOCIO + "</strong>.</p>" +
          "<div style='background: #fbf9f5; border: 1px solid #dfc89f; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;'>" +
            "<p style='margin: 0; font-size: 13px; color: #6e7d73;'>Tu número de pedido oficial es:</p>" +
            "<p style='margin: 8px 0; font-family: monospace; font-size: 24px; font-weight: bold; color: #3d5a4c;'>" + data.orderId + "</p>" +
            "<p style='margin: 0; font-size: 16px;'><strong>Importe Total: " + Number(data.total).toFixed(2) + " €</strong></p>" +
          "</div>" +
          (data.paymentMethod === 'bizum' ? 
            ("<div style='background: #eaf4ee; border: 1px solid #cbdbd0; padding: 16px; border-radius: 8px; margin-bottom: 20px;'>" +
               "<h4 style='color: #2e7d32; margin: 0 0 8px 0; font-size: 15px;'>Instrucciones para completar tu Bizum:</h4>" +
               "<p style='margin: 4px 0; font-size: 13px;'>1. Envía tu Bizum al teléfono: <strong>" + TELEFONO_BIZUM + "</strong></p>" +
               "<p style='margin: 4px 0; font-size: 13px;'>2. Concepto obligatorio: <strong>" + data.orderId + "</strong></p>" +
               "<p style='margin: 4px 0; font-size: 13px;'>3. Importe exacto: <strong>" + Number(data.total).toFixed(2) + " €</strong></p>" +
               "<p style='margin: 8px 0 0 0; font-size: 12px; color: #55645a;'>En cuanto verifiquemos el abono con tu concepto, comenzaremos a preparar tu paquete.</p>" +
             "</div>") : 
            ("<div style='background: #fbf9f5; border: 1px solid #cbdbd0; padding: 16px; border-radius: 8px; margin-bottom: 20px;'>" +
               "<h4 style='color: #3d5a4c; margin: 0 0 8px 0; font-size: 15px;'>Recogida en Tienda Física:</h4>" +
               "<p style='margin: 0; font-size: 13px;'>Tu paquete estará preparado en nuestra tienda en <strong>" + DIRECCION_TIENDA + "</strong>. Podrás abonarlo cómodamente en efectivo o tarjeta en el momento de la recogida.</p>" +
             "</div>")
          ) +
          "<h3 style='color: #3d5a4c; margin-bottom: 8px;'>Resumen de productos:</h3>" +
          "<ul style='line-height: 1.8; font-size: 14px;'>" + productosHtml + "</ul>" +
          "<p style='font-size: 12px; color: #6e7d73; margin-top: 24px; border-top: 1px solid #ece4d8; padding-top: 14px;'>" +
            "¿Tienes alguna duda sobre tu pedido? Responde directamente a este correo o llámanos al " + TELEFONO_BIZUM + "." +
          "</p>" +
        "</div>";

      MailApp.sendEmail({
        to: data.clientEmail,
        subject: asuntoCliente,
        htmlBody: cuerpoClienteHtml
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### 4.2. Guía de Instalación en Google Sheets (En 2 Minutos)
1. Abrir la hoja de cálculo de Google Drive del negocio.
2. Hacer clic en el menú superior: **Extensiones &rarr; Apps Script**.
3. Borrar cualquier código de prueba y pegar el bloque anterior.
4. Ajustar si se desea el correo `EMAIL_PEDIDOS = "pedidos@pepi.com"`.
5. Hacer clic en el botón azul superior **Implementar &rarr; Nueva implementación**:
   - Tipo: **Aplicación web**.
   - Descripción: `Recepción de pedidos tienda web`.
   - Ejecutar como: **Yo** (*tu cuenta de Google*).
   - Quién tiene acceso: **Cualquiera** (*Anyone*).
6. Pulsar **Implementar**, conceder los permisos habituales de Google y copiar la **URL de la aplicación web** generada (acabada en `/exec`).
7. Configurar esa URL en Vercel en la variable de entorno `GOOGLE_SHEET_ORDERS_WEBHOOK_URL`.

---

## 5. El Flujo de Compra en la Web (Opción 2 sin WhatsApp)

### 5.1. Guía de 4 Pasos en la Cabecera de la Tienda
En la parte superior de `/tienda`, justo bajo el título principal, se ubica la guía explicativa:
1. **Elige tus productos:** Aceites botánicos puros, minerales para chakras o saquitos térmicos.
2. **Entrega y Contacto:** Selecciona *Recogida en Tienda (Gratis · Boiro)* o *Envío a Domicilio* y facilita tus datos de recibo.
3. **Confirmación en Pantalla:** Se genera al instante el número oficial de comanda (`#BYN-XXXX`).
4. **Bizum o en Tienda:** Abona cómodamente mediante Bizum con tu número de pedido o paga al recoger en Boiro.

### 5.2. Panel Desplegable de Carrito y Checkout (`CartDrawer.tsx`)
- **Persistencia en LocalStorage:** El carrito no se pierde si el usuario navega entre terapias y tienda o refresca el navegador.
- **Validación instantánea:** Exige nombre, email y teléfono antes de confirmar.
- **Botones de 1 Clic para Bizum:** En la pantalla final de éxito, el cliente puede hacer clic en **"Copiar Número"** y **"Copiar Concepto"** para pegarlo directamente en su aplicación bancaria sin equivocaciones.

---

## 6. Cuadro de Mando de Archivos y Responsabilidades Técnicas

| Archivo / Ruta | Responsabilidad |
|---|---|
| `MEMORIA.md` | Este documento de memoria técnica, funcional y de arquitectura |
| `GOOGLE_SHEETS_TEMPLATE.md` | Guía de ayuda rápida para Pepi con el formato de las columnas |
| `src/app/page.tsx` | Landing page principal con todas las terapias, chakras y contacto en Boiro |
| `src/app/tienda/page.tsx` | Página servidora ISR de la Tienda Holística |
| `src/app/tienda/ShopClient.tsx` | Interfaz interactiva de la tienda: filtros, buscador y guía de 4 pasos |
| `src/components/CartDrawer.tsx` | Carrito, formulario de checkout en 2 pasos y confirmación con código de Bizum |
| `src/app/api/order/route.ts` | Endpoint serverless que recibe el pedido y lo reenvía a Google Apps Script |
| `src/lib/content.ts` | Conector que lee Google Sheets (o recurre a los datos locales si no hay red) |
| `src/data/defaultContent.ts` | Datos de respaldo por defecto con la ubicación oficial en Boiro |
| `src/context/CartContext.tsx` | Estado global del carrito con almacenamiento local persistente |

---

## 7. Conclusión y Próximos Pasos

Con esta arquitectura:
- Pepi dispone de una **web rápida, estética y moderna**.
- Cuenta con un **panel de control familiar (Google Sheets)** donde gestionar textos, productos y pedidos sin tocar código ni pagar cuotas.
- El cliente disfruta de una experiencia de compra **seria, transparente y directa**, recibiendo su comprobante al instante y con total facilidad para abonar por Bizum o retirar su compra en la tienda de Boiro.

---
*Fin de la Memoria Técnica.*
