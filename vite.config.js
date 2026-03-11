import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "container",
      remotes: {
        pricing: "https://micro-frontend-pricing.vercel.app/_next/static/chunks/remoteEntry.js",
        events: "https://micro-frontend-events.vercel.app/_next/static/chunks/remoteEntry.js"
      },
      shared: ["react", "react-dom"]
    })
  ],
  server: {
    proxy: {
      '/api/emails': {
        target: 'https://micro-frontend-events.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/emails/, '/api/emails'),
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      },
      '/api/userdata': {
        target: 'https://micro-frontend-pricing.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/userdata/, '/api/userdata'),
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    }
  },
  preview: {
    port: 5173,
    strictPort: true,
  }
});