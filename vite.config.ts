import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "",
    plugins: [
      react(),
      babel({
        presets: [reactCompilerPreset()],
      }),
      VitePWA({
        filename: "service-worker.js",
        injectRegister: false,
        includeAssets: ["favicon.svg", "screenshots/install-wide.png", "screenshots/install-mobile.png"],
        manifest: {
          short_name: "SREditor",
          name: "Steam Review Editor",
          description: "Create and edit Steam-ready review markup with offline support.",
          screenshots: [
            {
              src: "screenshots/install-wide.png",
              sizes: "1280x720",
              type: "image/png",
              form_factor: "wide",
            },
            {
              src: "screenshots/install-mobile.png",
              sizes: "540x720",
              type: "image/png",
            },
          ],
          start_url: "/",
          scope: "/",
          display: "standalone",
          theme_color: "#0f1419",
          background_color: "#0f1419",
        },
        pwaAssets: {
          config: "pwa-assets.config.ts",
          overrideManifestIcons: true,
        },
        devOptions: {
          enabled: true,
        },
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: "index.html",
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,json}"],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "html-documents",
                networkTimeoutSeconds: 5,
              },
            },
          ],
        },
      }),
    ],
    server: {
      open: true,
      port: Number(env.VITE_PORT) || 3000,
    },
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "react-vendor",
                test: /node_modules[\\/]react/,
                priority: 25,
              },
              {
                name: "ui-vendor",
                test: /node_modules[\\/]antd/,
                priority: 20,
              },
              {
                name: "tiptap-vendor",
                test: /node_modules[\\/]@tiptap/,
                priority: 15,
              },
              {
                name: "vendor",
                test: /node_modules/,
                priority: 10,
              },
              {
                name: "common",
                minShareCount: 2,
                minSize: 10000,
                priority: 5,
              },
            ],
          },
        },
      },
    },
  };
});
