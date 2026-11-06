import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Read assets directory
const assetsDir = path.join(distDir, 'assets');
const assetFiles = fs.readdirSync(assetsDir);

const cssFile = assetFiles.find(f => f.endsWith('.css'));
const jsFile = assetFiles.find(f => f.endsWith('.js'));
const imageFiles = assetFiles.filter(f => /\.(jpg|jpeg|png|svg|webp)$/i.test(f));

// Inline CSS
let css = '';
if (cssFile) {
  css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
}

// Inline JS
let js = '';
if (jsFile) {
  js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
}

// Inline all images as base64 in both JS and CSS
for (const file of imageFiles) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  const imgBuffer = fs.readFileSync(path.join(assetsDir, file));
  const base64Data = `data:${mime};base64,${imgBuffer.toString('base64')}`;

  const assetPath = `/assets/${file}`;
  js = js.split(assetPath).join(base64Data);
  css = css.split(assetPath).join(base64Data);
  html = html.split(assetPath).join(base64Data);

  js = js.split(`assets/${file}`).join(base64Data);
  css = css.split(`assets/${file}`).join(base64Data);
}

// Also check for root public images like /bg-metallic-flow.jpg or /profile.jpg in dist
const rootFiles = fs.readdirSync(distDir).filter(f => /\.(jpg|jpeg|png|svg|webp)$/i.test(f));
for (const file of rootFiles) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  const imgBuffer = fs.readFileSync(path.join(distDir, file));
  const base64Data = `data:${mime};base64,${imgBuffer.toString('base64')}`;

  const rootPath = `/${file}`;
  js = js.split(rootPath).join(base64Data);
  css = css.split(rootPath).join(base64Data);
  html = html.split(rootPath).join(base64Data);
}

if (css) {
  html = html.replace(/<link rel="stylesheet"[^>]+>/, `<style>\n${css}\n</style>`);
}

if (js) {
  html = html.replace(/<script type="module"[^>]+><\/script>/, `<script type="module">\n${js}\n</script>`);
}

const outputPath = path.join(distDir, 'portable-portfolio.html');
fs.writeFileSync(outputPath, html, 'utf8');

console.log('Successfully created standalone portable HTML with all embedded assets at:', outputPath);
console.log('File size:', fs.statSync(outputPath).size, 'bytes');
