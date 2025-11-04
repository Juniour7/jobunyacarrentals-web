// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";   // ← Correct import

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),

    // 🗺️ Automatically generate sitemap.xml on build
    Sitemap({
      hostname: "https://jobunyacarrentals.co.ke",    // ← Change to your live domain
      dynamicRoutes: [                          // Use the plugin’s option name
        "/",            // homepage
        "/fleet",       // fleet page
        "/contact",     // contact page
      ],
      outDir: "dist",                             // sitemap goes into your build output
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
