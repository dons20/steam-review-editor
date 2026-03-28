import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "",
    plugins: [react()],
    server: {
      open: true,
      port: Number(env.VITE_PORT) || 3000,
    },
    resolve: {
      tsconfigPaths: true,
    },
  };
});
