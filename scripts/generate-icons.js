import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  await sharp(svgBuffer).resize(192, 192).png().toFile('public/pwa-192x192.png');
  console.log('Generated pwa-192x192.png');

  await sharp(svgBuffer).resize(512, 512).png().toFile('public/pwa-512x512.png');
  console.log('Generated pwa-512x512.png');

  await sharp(svgBuffer).resize(512, 512).png().toFile('public/maskable-512x512.png');
  console.log('Generated maskable-512x512.png');

  await sharp(svgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');
}

generate().catch(console.error);
