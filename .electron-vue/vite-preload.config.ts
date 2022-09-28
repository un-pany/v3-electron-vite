import { join } from "path"
import { builtinModules } from "module"
import { defineConfig } from "vite"

// https://cn.vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, "../src/preload"),
  build: {
    emptyOutDir: true,
    outDir: "../../dist/preload",
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
