// generate-sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// === Get project directory ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Configuration ===
const BASE_URL = 'https://www.example.com'; // change to your live site URL
const OUTPUT_PATH = path.resolve(__dirname, 'dist', 'sitemap.xml');

// === Define your routes (React Router paths) ===
const routes = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/blog',
  '/blog/:id',
  '/pricing',
  '/faq'
];

// === Generate the sitemap ===
const sitemap = new SitemapStream({ hostname: BASE_URL });
const writeStream = createWriteStream(OUTPUT_PATH);
sitemap.pipe(writeStream);

routes.forEach((route) => {
  // Replace dynamic route parameters with sample or generic URLs
  const url = route.replace(/:([a-zA-Z]+)/g, 'sample-$1');
  sitemap.write({ url, changefreq: 'weekly', priority: 0.8 });
});

sitemap.end();

streamToPromise(sitemap).then(() => {
  console.log('✅ Sitemap generated at dist/sitemap.xml');
});
