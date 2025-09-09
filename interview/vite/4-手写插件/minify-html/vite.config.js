import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import htmlMinifyPlugin from "./plugins/vite-plugin-html-minify";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), htmlMinifyPlugin()],
});
