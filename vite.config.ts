import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  // Make VITE_* env vars available as import.meta.env.* in both client and SSR builds.
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), "VITE_"))) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  // Static hosting (e.g. GitHub Pages project site) serves the app from a
  // subpath. Build with GH_PAGES=true to prefix asset URLs and the router.
  const pagesBase = process.env.GH_PAGES ? "/legalaid-mp/" : "/";
  const routerBasepath = process.env.GH_PAGES ? "/legalaid-mp" : "/";
  envDefine["import.meta.env.VITE_ROUTER_BASEPATH"] = JSON.stringify(routerBasepath);

  return {
    base: pagesBase,
    define: envDefine,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
      ignoreOutdatedRequests: true,
    },
    plugins: [
      tailwindcss(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        prerender: {
          enabled: true,
          autoSubfolderIndex: true,
          autoStaticPathsDiscovery: true,
          crawlLinks: true,
          concurrency: 14,
        },
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        server: { entry: "server" },
      }),
      // Production SSR bundle targets Cloudflare Workers — except for static
      // hosting builds (GH_PAGES), which skip nitro entirely so the TanStack
      // prerender preview server can resolve the server bundle from dist/.
      ...(command === "build" && !process.env.GH_PAGES
        ? [nitro({ defaultPreset: "cloudflare-module" })]
        : []),
      viteReact(),
    ],
    server: { host: "::", port: 8080 },
  };
});
