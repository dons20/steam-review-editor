import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "",
    plugins: [
      react(),
      babel({
        presets: [reactCompilerPreset()],
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
