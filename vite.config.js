import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "container",

      remotes: {
        pricing: "http://localhost:3000/_next/static/chunks/remoteEntry.js",
        events: "http://localhost:3001/_next/static/chunks/remoteEntry.js"
      },

      shared: ["react", "react-dom"]
    })
  ]
});