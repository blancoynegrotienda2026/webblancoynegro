const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function createTransparentAsset(sourceData, width, height, cropX, cropY, cropW, cropH, fadeSide = null) {
  const outBuffer = Buffer.alloc(cropW * cropH * 4);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcX = cropX + x;
      const srcY = cropY + y;
      const srcIdx = (srcY * width + srcX) * 3;

      const r = sourceData[srcIdx];
      const g = sourceData[srcIdx + 1];
      const b = sourceData[srcIdx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      const dstIdx = (y * cropW + x) * 4;

      let alpha = 0;
      if (lum < 226) {
        const t = (226 - lum) / (226 - 65);
        alpha = Math.min(255, Math.max(0, Math.round(t * 255)));
      }

      // Si se especifica difuminado lateral para eliminar cualquier mota en el borde interior
      if (fadeSide === "right" && x > cropW - 20) {
        const fade = (cropW - x) / 20;
        alpha = Math.round(alpha * fade);
      } else if (fadeSide === "left" && x < 20) {
        const fade = x / 20;
        alpha = Math.round(alpha * fade);
      }

      // Color de carboncillo puro (#212924)
      outBuffer[dstIdx] = 33;     // R
      outBuffer[dstIdx + 1] = 41; // G
      outBuffer[dstIdx + 2] = 36; // B
      outBuffer[dstIdx + 3] = alpha;
    }
  }

  return sharp(outBuffer, { raw: { width: cropW, height: cropH, channels: 4 } });
}

async function run() {
  const logoPath = path.join(__dirname, "../Logos/logo.png");
  const brandDir = path.join(__dirname, "../public/brand");

  const { data, info } = await sharp(logoPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;

  // 1. Caña de bambú izquierda completa
  const leftW = 220;
  const leftH = 1402;
  const leftImg = createTransparentAsset(data, W, H, 0, 0, leftW, leftH, "right");
  await leftImg.webp({ quality: 90 }).toFile(path.join(brandDir, "bamboo-left.webp"));
  await leftImg.png().toFile(path.join(brandDir, "bamboo-left.png"));

  // 2. Caña de bambú derecha completa
  const rightX = 900;
  const rightW = W - rightX;
  const rightImg = createTransparentAsset(data, W, H, rightX, 0, rightW, leftH, "left");
  await rightImg.webp({ quality: 90 }).toFile(path.join(brandDir, "bamboo-right.webp"));
  await rightImg.png().toFile(path.join(brandDir, "bamboo-right.png"));

  // 3. Rama de hojas superior izquierda
  const branchLW = 410;
  const branchLH = 280;
  const branchLImg = createTransparentAsset(data, W, H, 0, 0, branchLW, branchLH, "right");
  await branchLImg.webp({ quality: 90 }).toFile(path.join(brandDir, "bamboo-branch-left.webp"));

  // 4. Rama de hojas superior derecha
  const branchRX = 710;
  const branchRW = W - branchRX;
  const branchRH = 280;
  const branchRImg = createTransparentAsset(data, W, H, branchRX, 0, branchRW, branchRH, "left");
  await branchRImg.webp({ quality: 90 }).toFile(path.join(brandDir, "bamboo-branch-right.webp"));

  // 5. Hojas inferiores
  const bottomRX = 790;
  const bottomRY = 780;
  const bottomRW = W - bottomRX;
  const bottomRH = 430;
  const bottomImg = createTransparentAsset(data, W, H, bottomRX, bottomRY, bottomRW, bottomRH, "left");
  await bottomImg.webp({ quality: 90 }).toFile(path.join(brandDir, "bamboo-leaves-bottom.webp"));

  console.log("¡Todos los assets de bambú regenerados con bordes perfectamente limpios!");
}

run().catch((err) => {
  console.error("Error al procesar bambú:", err);
  process.exit(1);
});
