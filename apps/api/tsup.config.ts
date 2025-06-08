import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/**/*.{js,ts}"],
  dts: false,
  watch: options.watch,
  tsconfig: "./tsconfig.json",
  treeshake: true,
  format: ["esm"],
  clean: true,
  minify: false,
  sourcemap: options.watch ? true : false,
  bundle: false,
  esbuildOptions(options) {
    options.outbase = "src";
  },
  keepNames: true,
  ignoreWatch: ["**/*.d.ts", "node_modules", "dist"],
}));
