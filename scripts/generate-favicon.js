const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="31" fill="#3d5a4c" />
  <g transform="translate(11.6, 11.6) scale(1.7)" fill="none" stroke="#dfc89f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" fill="#dfc89f" fill-opacity="0.3" />
    <path d="M20 2v4" />
    <path d="M22 4h-4" />
    <circle cx="4" cy="20" r="2" fill="#dfc89f" />
  </g>
</svg>`;

// Guardar SVG en app y public
fs.writeFileSync(path.join(__dirname, "../src/app/icon.svg"), svgContent);
fs.writeFileSync(path.join(__dirname, "../public/icon.svg"), svgContent);
fs.writeFileSync(path.join(__dirname, "../public/favicon.svg"), svgContent);

// Renderizar PNG y crear favicon.ico
sharp(Buffer.from(svgContent))
  .resize(64, 64)
  .png()
  .toBuffer()
  .then((pngBuffer) => {
    fs.writeFileSync(path.join(__dirname, "../src/app/icon.png"), pngBuffer);
    fs.writeFileSync(path.join(__dirname, "../public/icon.png"), pngBuffer);

    // Header ICO con formato PNG incrustado
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type 1 = ICO
    header.writeUInt16LE(1, 4); // 1 image

    const dirEntry = Buffer.alloc(16);
    dirEntry.writeUInt8(64, 0); // Width 64
    dirEntry.writeUInt8(64, 1); // Height 64
    dirEntry.writeUInt8(0, 2); // Colors (0 = >=256)
    dirEntry.writeUInt8(0, 3); // Reserved
    dirEntry.writeUInt16LE(1, 4); // Color planes
    dirEntry.writeUInt16LE(32, 6); // Bits per pixel
    dirEntry.writeUInt32LE(pngBuffer.length, 8); // Size of image data
    dirEntry.writeUInt32LE(22, 12); // Offset

    const icoData = Buffer.concat([header, dirEntry, pngBuffer]);
    fs.writeFileSync(path.join(__dirname, "../src/app/favicon.ico"), icoData);
    fs.writeFileSync(path.join(__dirname, "../public/favicon.ico"), icoData);

    console.log("¡Favicon e iconos creados exitosamente! Tamaño:", icoData.length, "bytes");
  })
  .catch((err) => {
    console.error("Error al generar favicon:", err);
    process.exit(1);
  });
