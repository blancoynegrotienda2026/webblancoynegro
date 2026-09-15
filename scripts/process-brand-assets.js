const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function run() {
  const logoPath = path.join(__dirname, "../Logos/logo.png");
  const brandDir = path.join(__dirname, "../public/brand");

  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
  }

  // 1. Optimizar y guardar el logo completo en PNG y WebP
  await sharp(logoPath)
    .resize(900, null, { withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(brandDir, "logo-full.webp"));

  await sharp(logoPath)
    .resize(900, null, { withoutEnlargement: true })
    .png({ compressionLevel: 8 })
    .toFile(path.join(brandDir, "logo-full.png"));

  console.log("1. Logo completo optimizado a WebP y PNG");

  // 2. Extraer el Yin-Yang circular exacto
  const yinyangCrop = await sharp(logoPath)
    .extract({ left: 232, top: 235, width: 685, height: 685 })
    .toBuffer();

  const circleMask = Buffer.from(
    `<svg width="685" height="685"><circle cx="342.5" cy="342.5" r="338" fill="white" /></svg>`
  );

  const yinyangCircleBuffer = await sharp(yinyangCrop)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(brandDir, "yinyang.png"), yinyangCircleBuffer);
  await sharp(yinyangCircleBuffer)
    .webp({ quality: 95 })
    .toFile(path.join(brandDir, "yinyang.webp"));

  console.log("2. Yin-Yang circular extraído con transparencia");

  // 3. Extraer el bambú izquierdo y derecho para fondos decorativos
  await sharp(logoPath)
    .extract({ left: 0, top: 0, width: 300, height: 1402 })
    .webp({ quality: 85 })
    .toFile(path.join(brandDir, "bamboo-left.webp"));

  await sharp(logoPath)
    .extract({ left: 822, top: 0, width: 300, height: 1402 })
    .webp({ quality: 85 })
    .toFile(path.join(brandDir, "bamboo-right.webp"));

  console.log("3. Cañas de bambú laterales extraídas para decoración de fondos");

  // 4. Generar Favicons usando el Yin-Yang real
  // Favicon PNG 64x64
  const favicon64 = await sharp(yinyangCircleBuffer)
    .resize(64, 64)
    .png()
    .toBuffer();

  // Favicon PNG 192x192 para móviles / PWA
  const favicon192 = await sharp(yinyangCircleBuffer)
    .resize(192, 192)
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(__dirname, "../public/icon.png"), favicon192);
  fs.writeFileSync(path.join(__dirname, "../src/app/icon.png"), favicon192);

  // Favicon .ICO con el Yin-Yang de la clienta
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const icoDirEntry = Buffer.alloc(16);
  icoDirEntry.writeUInt8(64, 0); // Width 64
  icoDirEntry.writeUInt8(64, 1); // Height 64
  icoDirEntry.writeUInt8(0, 2); // Colors
  icoDirEntry.writeUInt8(0, 3); // Reserved
  icoDirEntry.writeUInt16LE(1, 4); // Color planes
  icoDirEntry.writeUInt16LE(32, 6); // Bits per pixel
  icoDirEntry.writeUInt32LE(favicon64.length, 8); // Size of image data
  icoDirEntry.writeUInt32LE(22, 12); // Offset

  const fullIco = Buffer.concat([icoHeader, icoDirEntry, favicon64]);
  fs.writeFileSync(path.join(__dirname, "../src/app/favicon.ico"), fullIco);
  fs.writeFileSync(path.join(__dirname, "../public/favicon.ico"), fullIco);

  // SVG Favicon incrustando el Yin-Yang optimizado
  const base64Png = favicon192.toString("base64");
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <image href="data:image/png;base64,${base64Png}" width="64" height="64" />
</svg>`;

  fs.writeFileSync(path.join(__dirname, "../src/app/icon.svg"), svgFavicon);
  fs.writeFileSync(path.join(__dirname, "../public/icon.svg"), svgFavicon);
  fs.writeFileSync(path.join(__dirname, "../public/favicon.svg"), svgFavicon);

  console.log("4. Favicons generados exitosamente con el Yin-Yang real de la clienta");

  // Limpiar archivos de prueba temporales
  const testCrop1 = path.join(brandDir, "test_crop.png");
  const testCrop2 = path.join(brandDir, "test_crop2.png");
  if (fs.existsSync(testCrop1)) fs.unlinkSync(testCrop1);
  if (fs.existsSync(testCrop2)) fs.unlinkSync(testCrop2);
}

run().catch((err) => {
  console.error("Error procesando assets de marca:", err);
  process.exit(1);
});
