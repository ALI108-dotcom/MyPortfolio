import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Read assets directory
const assetsDir = path.join(distDir, 'assets');
const assetFiles = fs.readdirSync(assetsDir);

const cssFile = assetFiles.find(f => f.endsWith('.css'));
const jsFile = assetFiles.find(f => f.endsWith('.js'));
const imageFile = assetFiles.find(f => f.endsWith('.jpg') || f.endsWith('.png'));

// Inline image as base64 in JS/HTML
let imageBase64 = '';
if (imageFile) {
  const imgBuffer = fs.readFileSync(path.join(assetsDir, imageFile));
  imageBase64 = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;
}

if (cssFile) {
  const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
  html = html.replace(/<link rel="stylesheet"[^>]+>/, `<style>\n${css}\n</style>`);
}

if (jsFile) {
  let js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
  if (imageFile && imageBase64) {
    // Replace asset path in JS bundle with base64 data URL
    const assetPath = `/assets/${imageFile}`;
    js = js.split(assetPath).join(imageBase64);
  }
  html = html.replace(/<script type="module"[^>]+><\/script>/, `<script type="module">\n${js}\n</script>`);
}

const outputPath = path.join(distDir, 'portable-portfolio.html');
fs.writeFileSync(outputPath, html, 'utf8');

console.log('Successfully created standalone portable HTML with embedded image at:', outputPath);
console.log('File size:', fs.statSync(outputPath).size, 'bytes');
