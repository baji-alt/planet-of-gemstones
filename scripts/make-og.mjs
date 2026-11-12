// Generates /public/og.png (1200×630) and /public/apple-touch-icon.png from the SVG logo.
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const logo = readFileSync('public/logo.svg', 'utf8')
const inner = logo.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="bg" cx="0.3" cy="0.4" r="0.9"><stop offset="0" stop-color="#4A1428"/><stop offset="1" stop-color="#0E0E12"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g transform="translate(110 125) scale(1.9)">${inner}</g>
  <text x="560" y="250" font-family="Georgia, serif" font-size="64" fill="#F5EDE6">Planet of Gemstones</text>
  <text x="560" y="330" font-family="Arial, sans-serif" font-size="46" fill="#E6CB86">ديوان الأحجار الكريمة</text>
  <rect x="560" y="370" width="120" height="2" fill="#C9A24B"/>
  <text x="560" y="425" font-family="Georgia, serif" font-style="italic" font-size="32" fill="#EAD9D2">Natural stones, written in the stars · Beirut</text>
</svg>`
await sharp(Buffer.from(og)).png().toFile('public/og.png')
await sharp(Buffer.from(logo)).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('og.png + apple-touch-icon.png written')
