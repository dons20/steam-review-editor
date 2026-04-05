import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      assets: fileURLToPath(new URL("./src/assets", import.meta.url)),
      components: fileURLToPath(new URL("./src/components", import.meta.url)),
      util: fileURLToPath(new URL("./src/util", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
