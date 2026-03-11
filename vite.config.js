import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "container",
      remotes: {
        pricing:
          "https://micro-frontend-pricing.vercel.app/_next/static/chunks/remoteEntry.js",
        events:
          "https://micro-frontend-events.vercel.app/_next/static/chunks/remoteEntry.js"
      },
      shared: ["react", "react-dom"]
    })
  ],

  preview: {
    port: 5173,
    strictPort: true
  },

  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});