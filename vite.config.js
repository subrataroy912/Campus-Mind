import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx}"',
      },
    }),
  ],
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react/") ||
              id.includes("react-dom/") ||
              id.includes("react-router/")
            ) {
              return "vendor-react";
            }
            if (
              id.includes("@reduxjs/toolkit") ||
              id.includes("react-redux")
            ) {
              return "vendor-redux";
            }
            if (id.includes("lucide-react") || id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (
              id.includes("@base-ui") ||
              id.includes("@shadcn") ||
              id.includes("clsx") ||
              id.includes("cmdk") ||
              id.includes("class-variance-authority")
            ) {
              return "vendor-ui";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
