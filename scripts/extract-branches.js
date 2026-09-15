const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function extractBranches() {
  const logoPath = path.join(__dirname, "../Logos/logo.png");
  const brandDir = path.join(__dirname, "../public/brand");

  // 1. Rama de hojas superior izquierda (sin tocar el círculo del Yin Yang)
  await sharp(logoPath)
    .extract({ left: 0, top: 0, width: 430, height: 300 })
    .webp({ quality: 88 })
    .toFile(path.join(brandDir, "bamboo-branch-left.webp"));

  // 2. Rama de hojas superior derecha (sin tocar el círculo)
  await sharp(logoPath)
    .extract({ left: 710, top: 0, width: 412, height: 300 })
    .webp({ quality: 88 })
    .toFile(path.join(brandDir, "bamboo-branch-right.webp"));

  // 3. Follaje de hojas lateral inferior derecho
  await sharp(logoPath)
    .extract({ left: 780, top: 780, width: 342, height: 440 })
    .webp({ quality: 88 })
    .toFile(path.join(brandDir, "bamboo-leaves-bottom.webp"));

  console.log("Ramas de hojas limpiadas y extraídas perfectamente.");
}

extractBranches().catch(console.error);
