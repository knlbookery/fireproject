import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// Conventional static Vite SPA — no SSR, no Nitro, no Netlify build target.
// See CLAUDE.md sections 5, 8, and 17 for the target architecture and the
// Netlify/TanStack Start removal record.
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsConfigPaths(),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    // Fail loudly if 5173 is already in use instead of silently starting on
    // 5174, 5175, and so on. Vite's default is to drift to the next free
    // port, which quietly leaves earlier dev servers running and pointed at
    // stale code — the browser tab you already have open keeps loading from
    // a server that is no longer the one rebuilding your changes. Dev only;
    // has no effect on `npm run build` or on production.
    strictPort: true,
    proxy: {
      // Bridge-testing only: proxy /api/*.php to a local PHP dev server so
      // the frontend can be exercised against server/public-api during
      // `npm run dev`. Start it with:
      //   php -S localhost:8080 -t server/public-api
      // Production frontend calls remain relative /api/*.php (CLAUDE.md
      // section 19); nothing here is used at build/deploy time.
      "^/api/.*\\.php$": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
