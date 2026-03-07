import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "./",

  build: {
    rollupOptions: {
      output: {
        // This function splits your 'node_modules' into a separate file
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split heavy libraries into their own chunks
            if (id.includes('@tanstack') || id.includes('react-router-dom')) {
              return 'vendor-core';
            }
            if (id.includes('framer-motion') || id.includes('react-icons')) {
              return 'vendor-ui';
            }
            return 'vendor'; // everything else from node_modules
          }
        },
      },
    },
    // Optional: Increases the limit so the warning disappears
    chunkSizeWarningLimit: 1000,
  },
});
