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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Only group libraries here that are genuinely needed on every
            // single page load (React itself, routing, data fetching) -
            // that makes this one chunk worth its size, since it's shared
            // and long-cacheable rather than re-downloaded per route.
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/') || id.includes('@tanstack') || id.includes('react-router-dom')) {
              return 'vendor-core';
            }
            // Firebase (auth) is also needed early - AuthProvider wraps the
            // whole app - but it's large and changes independently of the
            // rest of the app's code, so it gets its own cacheable chunk
            // rather than bloating vendor-core.
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('framer-motion') || id.includes('react-icons')) {
              return 'vendor-ui';
            }
            // Deliberately no catch-all "everything else -> one vendor
            // blob" bucket here anymore. That used to force every page
            // load to download a single 700KB+ chunk containing libraries
            // most routes never touch at all - swiper (only the home page
            // carousel), sweetalert2 (only confirm dialogs on a handful of
            // admin actions), react-hook-form (only a few forms), etc.
            // Leaving those unassigned lets Rollup follow the real import
            // graph and bundle each one only into the lazy route chunk(s)
            // (see main.jsx's React.lazy calls) that actually import it -
            // so e.g. the login page no longer pays to download the
            // carousel library it never uses.
          }
        },
      },
    },
    // Optional: Increases the limit so the warning disappears
    chunkSizeWarningLimit: 1000,
  },
});
