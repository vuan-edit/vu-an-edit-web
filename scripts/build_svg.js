const TextToSVG = require('text-to-svg');
const fs = require('fs');
const path = require('path');

const fontPath = '/Volumes/12AM_VuAn_SSD/Code/Vu An Edit Web/public/fonts/Averta-Black.otf';
const textToSVG = TextToSVG.loadSync(fontPath);

const options = { x: 0, y: 0, fontSize: 280, anchor: 'top baseline', attributes: { fill: '#000000' } };

const metricsVU = textToSVG.getMetrics('VU', options);
const pathVU = textToSVG.getPath('VU', options);

const metricsAN = textToSVG.getMetrics('AN', options);
const pathAN = textToSVG.getPath('AN', options);

// Center the elements in a 500x500 box
// calculate offsets
// let's just create raw paths and wrap it in an SVG with viewBox
const w = 500;
const h = 500;

const totalHeight = metricsVU.height + metricsAN.height;

// Position for VU
const yVU = 230;

// Position for AN
const yAN = 460;

// We want them centered horizontally.
const xVU = (500 - metricsVU.width) / 2;
const xAN = (500 - metricsAN.width) / 2;

const optionsVU = { x: xVU, y: yVU, fontSize: 240, anchor: 'left baseline', attributes: { fill: '#111111' } };
const optionsAN = { x: xAN, y: yAN, fontSize: 240, anchor: 'left baseline', attributes: { fill: '#111111' } };

const finalPathVU = textToSVG.getPath('VU', optionsVU);
const finalPathAN = textToSVG.getPath('AN', optionsAN);

const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" fill="#ffffff" />
  ${finalPathVU}
  ${finalPathAN}
</svg>`;

const outputPath = '/Volumes/12AM_VuAn_SSD/Code/Vu An Edit Web/public/logo_brand.svg';
const faviconPath = '/Volumes/12AM_VuAn_SSD/Code/Vu An Edit Web/public/vite.svg';

fs.writeFileSync(outputPath, svgStr);
fs.writeFileSync(faviconPath, svgStr); // Replace vite.svg which is used as favicon

console.log("SVG generated correctly!");
