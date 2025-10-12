import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/widget/lib/main.js"),
      // formats: ["es"],
      name: "tamtam-article",
      fileName: "main",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
});
