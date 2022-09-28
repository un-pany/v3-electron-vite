import { join } from "path"
import { builtinModules } from "module"
import { defineConfig } from "vite"

// https://cn.vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, "../src/main"),
  build: {
    emptyOutDir: true,
    outDir: "../../dist/main",
    assetsDir: "./assets",
    lib: {
      entry: "index.ts",
      formats: ["cjs"]
    },
    minify: process.env.NODE_ENV === "production",
    rollupOptions: {
      external: [...builtinModules, "electron"],
      output: {
        entryFileNames: "[name].cjs"
      }
    }
  }
})
