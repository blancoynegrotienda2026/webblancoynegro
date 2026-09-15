# Guía de Conexión: Google Sheets y Google Drive para "Blanco y Negro - Terapias Holísticas y Bienestar"

Esta guía explica cómo la dueña del negocio o la persona encargada de la web puede actualizar textos, precios, fotos y reseñas sin tocar una sola línea de código.

---

## 1. Crear la Hoja en Google Sheets

Crea una hoja de cálculo en Google Drive (por ejemplo, llamada `Web Blanco y Negro - Contenidos`) y crea las siguientes 4 pestañas:

### Pestaña 1: `Terapias`
Encabezados en la fila 1:
- `id`: identificador único (ej: `quiromasaje-1`)
- `titulo`: Nombre de la terapia (ej: `Quiromasaje Terapéutico`)
- `subtitulo`: Frase explicativa corta
- `categoria`: Una de estas: `quiromasaje`, `reiki`, `registros_akashicos`, `respiracion`
- `etiqueta`: Texto del badge (ej: `Cuerpo & Músculo`)
- `descripcion_corta`: Resumen en una frase
- `descripcion_completa`: Descripción detallada de la sesión
- `beneficios`: Beneficios separados por punto y coma `;` (ej: `Alivio cervical; Drenaje linfático; Menos contracturas`)
- `duracion`: Duración (ej: `60 minutos`)
- `precio`: Precio o nota (ej: `50€` o `Consultar bonos`)
- `imagen`: Enlace compartido de la foto en **Google Drive** o Unsplash
- `destacado`: Opcional (ej: `Más Demandado`)

### Pestaña 2: `Talleres`
Encabezados en la fila 1:
- `id`: identificador único (ej: `taller-reiki-1`)
- `titulo`: Nombre del taller o charla
- `subtitulo`: Breve resumen
- `fecha`: Fecha (ej: `Sábado 24 de Octubre`)
- `horario`: Horario (ej: `10:00 - 18:30 h`)
- `modalidad`: `Presencial`, `Online / Streaming` o `Híbrido`
- `plazas`: Plazas disponibles (ej: `Máximo 8 plazas`)
- `descripcion`: Qué se aprenderá y cómo será la jornada
- `incluye`: Elementos incluidos separados por punto y coma `;` (ej: `Manual ilustrado; Diploma; Pausa café`)
- `imagen`: Enlace compartido de la foto en **Google Drive**

### Pestaña 3: `Armonizacion`
Encabezados en la fila 1:
- `id`: identificador único (ej: `mineral-amatista`)
- `titulo`: Nombre del producto o servicio de armonización
- `categoria`: `minerales`, `aromaterapia`, `herramientas` o `espacios`
- `etiqueta`: Texto del badge (ej: `Cristales de la Tierra`)
- `descripcion`: Para qué sirve y su energía
- `propiedades`: Propiedades separadas por punto y coma `;`
- `consejo`: Cómo se usa o dónde colocarlo
- `imagen`: Enlace compartido de Google Drive

### Pestaña 4: `Reseñas`
Encabezados en la fila 1:
- `id`: identificador (ej: `resena-1`)
- `nombre`: Nombre del cliente (ej: `Carmen N.`)
- `servicio`: Terapia que recibió (ej: `Quiromasaje Terapéutico`)
- `estrellas`: Número del 1 al 5 (ej: `5`)
- `comentario`: Texto del testimonio
- `fecha`: Fecha o antigüedad (ej: `Hace 2 semanas`)

### Pestaña 5: `Productos`
Encabezados en la fila 1:
- `id`: identificador (ej: `aceite-lavanda`)
- `nombre`: Nombre del producto
- `categoria`: `aromaterapia`, `minerales`, `herramientas` o `armonizacion`
- `etiqueta`: Texto del badge (ej: `Aromaterapia`)
- `descripcion_corta`: Resumen
- `descripcion_completa`: Descripción extendida
- `precio`: PVP en euros (ej: `16.50`)
- `precio_anterior`: Opcional para mostrar rebaja
- `destacado`: Badge especial (ej: `Más Vendido`)
- `beneficios`: Separados por punto y coma `;`
- `imagen`: Enlace de foto (Vercel Blob o Drive)
- `stock_actual`: Número de unidades físicas disponibles en tienda
- `accion_agotado`: `ocultar` | `mostrar_agotado` | `bajo_encargo`

### Pestaña 6: `SeccionesWeb`
Permite reordenar y activar/desactivar bloques desde el TPV:
- `id`: identificador (ej: `sec-1`)
- `orden`: Número de orden (ej: `1, 2, 3...`)
- `tipo_plantilla`: `hero`, `terapias`, `chakras`, `talleres`, `productos`, `sobre_mi`, `resenas`, `contacto`, `texto_foto`, `tarjetas`, `banner`, `faq`
- `titulo`: Título de la sección
- `subtitulo`: Subtítulo explicativo
- `activo`: `TRUE` o `FALSE`

### Pestaña 7: `Configuracion`
Textos generales del negocio que Pepi puede cambiar desde el TPV:
- `clave`: Clave interna (`nombre`, `telefono`, `whatsapp`, `email`, `direccion`, `ciudad`, `horario`, `bio`)
- `valor`: Texto correspondiente

---


## 2. Cómo usar fotos de Google Drive

1. Sube la fotografía a tu carpeta de **Google Drive**.
2. Haz clic derecho sobre la foto > **Compartir** > **Compartir**.
3. En **Acceso general**, selecciona: **"Cualquier persona con el enlace"** (como Lector).
4. Haz clic en **Copiar enlace**.
5. Pega ese enlace directamente en la columna `imagen` de la hoja.
6. **Vercel se encarga del resto**: Nuestro sistema extrae el ID de la foto y la descarga a través del CDN optimizándola a formato **WebP/AVIF**, de modo que la web nunca cargará lento ni sobrecargará Google Drive.

---

## 3. Botón "Publicar en la Web" (Google Apps Script)

Para que al hacer cambios en la hoja no haya que esperar, creamos un botón en el menú de Google Sheets:

1. En tu hoja de Google Sheets, haz clic en **Extensiones** > **Apps Script**.
2. Borra todo el código que aparezca y pega este:

```javascript
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🌟 Web Blanco y Negro')
    .addItem('🚀 Publicar Cambios en la Web', 'triggerDeployWeb')
    .addToUi();
}

function triggerDeployWeb() {
  // Reemplaza esta URL por tu Deploy Hook de Vercel (obtenido en Settings > Git > Deploy Hooks)
  var vercelDeployHookUrl = "https://api.vercel.com/v1/integrations/deploy/prj_XXXXX/YYYYY";
  
  try {
    var response = UrlFetchApp.fetch(vercelDeployHookUrl, {
      method: "post"
    });

    SpreadsheetApp.getUi().alert(
      '✅ ¡Publicación Solicitada!',
      'Vercel está actualizando la web y optimizando las fotos. En 30-45 segundos los cambios estarán en vivo.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Error al publicar: ' + error.toString());
  }
}
```

3. Pulsa **Guardar** (icono de disquete).
4. Cierra la pestaña de Apps Script y recarga tu hoja de Google Sheets.
5. Verás un nuevo menú arriba a la derecha: **"🌟 Web Blanco y Negro"**.
6. Cada vez que hagas cambios en precios o textos, pulsas **"🚀 Publicar Cambios en la Web"** y ¡listo!

---

## 4. Compartir la hoja como pública para que Vercel la lea

1. En la hoja de cálculo, haz clic en **Archivo** > **Compartir** > **Publicar en la web**.
2. Selecciona **Todo el documento** y formato **Página web** o **Valores separados por comas (.csv)**.
3. Haz clic en **Publicar**.
4. Copia el ID de la hoja desde la URL de tu navegador:
   `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit...`
5. Añade la variable de entorno en Vercel:
   `GOOGLE_SHEET_ID=ESTE_ES_EL_ID`
