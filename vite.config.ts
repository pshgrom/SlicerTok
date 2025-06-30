import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import dynamicImport from "vite-plugin-dynamic-import";

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => ['masked-input'].includes(tag)
      }
    }
  }), dynamicImport(), svgLoader()],
  optimizeDeps: {
    include: ['vue-the-mask']
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
