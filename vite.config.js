import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  // Must be root-relative, not "./" - this is a client-side-routed SPA
  // served with a catch-all rewrite to /index.html (see firebase.json), so
  // any nested route (e.g. /dashboard/adminhome) can be hit directly via
  // hard reload or a bookmark. With a relative base, that same index.html's
  // "./assets/..." references resolve against the CURRENT url instead of
  // the site root (e.g. "/dashboard/assets/..."), which doesn't exist -
  // Firebase's rewrite then serves index.html's HTML in place of the JS
  // file, the browser fails to parse it as a script, and the whole app
  // fails to boot: a blank page on every direct/reload hit to any non-root
  // route. Root-relative paths resolve correctly no matter how deep the
  // current URL is.
  base: "/",

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
