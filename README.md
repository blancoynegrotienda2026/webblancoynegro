# Blanco y Negro - Terapias Holísticas y Bienestar

Sitio web profesional, ultra-rápido y elegante para un centro de terapias holísticas especializado en:
- **Quiromasaje & Masaje Terapéutico** (descontracturante, relajante, descarga muscular)
- **Reiki Usui & Equilibrio de los 7 Chakras** (sanación energética canalizada)
- **Lectura de Registros Akáshicos** (propósito vital, sanación kármica)
- **Respiración Consciente / Pranayama & Breathwork** (calma del sistema nervioso)
- **Talleres, Charlas y Círculos de Sanación**
- **Espacio Botánico y Armonización Energética** (minerales, gemoterapia, aromaterapia sagrada, herramientas de autocuidado y limpieza energética de espacios)
- **Reseñas verificadas con valoración 5 estrellas**
- **Sistema de Citas y Asistente Interactivo** (integración directa con Google Calendar y WhatsApp)

---

## 🌟 Características Técnicas

- **Framework**: Next.js 14/15 con App Router, TypeScript y Tailwind CSS.
- **Rendimiento Máximo**: Renderizado estático incremental (ISR) alojado en el Edge CDN de Vercel (carga < 1s).
- **Gestión de Contenidos mediante Google Sheets**: El cliente puede modificar textos, precios, talleres y reseñas directamente en un Google Sheet sin necesidad de tocar código.
- **Optimización de Fotos de Google Drive**: Las fotos subidas a Google Drive son transformadas automáticamente a formatos de última generación (**WebP / AVIF**) y cacheadas en la CDN, sin penalizar la velocidad de la web.
- **Botón de Publicación con 1 Clic**: Mediante un Google Apps Script integrado en el Google Sheet, el cliente pulsa `[🌟 Web Blanco y Negro] -> [🚀 Publicar Cambios en la Web]` para desplegar sus actualizaciones en Vercel en ~30 segundos.

---

## 🚀 Despliegue en Vercel

1. Entra en [Vercel](https://vercel.com/) y haz clic en **Add New Project**.
2. Conecta tu cuenta de GitHub y selecciona el repositorio: `aalcaide45cy/webpepireiki`.
3. Vercel detectará automáticamente que es un proyecto **Next.js**.
4. Haz clic en **Deploy**. ¡Tu web estará online con certificado SSL gratuito en 1 minuto!

### Variables de Entorno Opcionales (en Vercel Settings > Environment Variables):
- `GOOGLE_SHEET_ID`: El ID de tu hoja de Google Sheets (ver guía en `GOOGLE_SHEETS_TEMPLATE.md`).
- `REVALIDATE_SECRET`: Token secreto para revalidar la caché (por defecto: `aura-pepi-secret-key`).

---

## 🛠️ Desarrollo en Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## 📋 Guía para el Cliente de Google Sheets

Consulta el archivo [GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md) para ver la estructura exacta de columnas y el código de Google Apps Script.
