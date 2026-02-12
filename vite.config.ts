import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "",
    plugins: [react(), viteTsconfigPaths()],
    server: {
      open: true,
      port: Number(env.VITE_PORT) || 3000,
    }
  };
});
