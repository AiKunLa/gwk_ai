import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path"; // vite 工程化工具，

export default defineConfig({
  plugins: [react()],
  resolve: {
    //别名
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
