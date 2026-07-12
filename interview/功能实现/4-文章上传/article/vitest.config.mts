import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}", "**/*.integration.test.{ts,tsx}"],
    exclude: ["e2e/**/*.spec.ts", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["lib/**/*.ts", "components/editor/upload-client.ts"],
      exclude: [
        "**/*.test.*",
        "**/*.integration.test.*",
        "**/index.ts",
        "lib/server/runtime.ts",
        "lib/server/storage/ali-oss-storage.ts",
        "lib/server/storage/fake-object-storage.ts",
        "lib/rich-text/article-image.ts",
        "lib/rich-text/extensions.ts",
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
