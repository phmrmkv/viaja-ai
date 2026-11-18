// Gera favicon-32.png, apple-touch-icon.png e og-image.jpg a partir do logo tipográfico provisório.
// Uso: node scripts/gerar-marca.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const favicon = readFileSync('public/favicon.svg');
await sharp(favicon, { density: 600 }).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(favicon, { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');

const marca = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="none">
    <rect x="1" y="1" width="30" height="30" rx="8" fill="#ff6b72"/>
    <path d="M9.5 22.5C9.5 15 22.5 17 22.5 9.5" stroke="#1b1d21" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="0.1 4.2"/>
    <circle cx="9.5" cy="22.5" r="3.6" fill="#1b1d21" stroke="#ff6b72" stroke-width="2"/>
    <circle cx="22.5" cy="9.5" r="3.6" fill="#1b1d21" stroke="#ff6b72" stroke-width="2"/>
  </g>`;
const fonte = "font-family=\"Segoe UI, Arial, Helvetica, sans-serif\"";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#1b1d21"/>
  <rect width="1200" height="14" fill="#ff6b72"/>
  ${marca(80, 70, 2.6)}
  <text x="185" y="132" ${fonte} font-size="56" font-weight="800" fill="#f2f2f0">Viaja<tspan fill="#b9bcc3">.ai</tspan></text>
  <text x="80" y="330" ${fonte} font-size="86" font-weight="800" fill="#f2f2f0">Diga para onde.</text>
  <text x="80" y="430" ${fonte} font-size="86" font-weight="800" fill="#ff6b72">A IA monta o roteiro.</text>
  <text x="80" y="540" ${fonte} font-size="34" font-weight="600" fill="#b9bcc3">Assistente com IA para planejar viagens. Em desenvolvimento.</text>
</svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile('public/og-image.jpg');
console.log('marca gerada');
