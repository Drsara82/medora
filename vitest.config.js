import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    css: false,
    setupFiles: ["./src/test-setup.js"],
  },
});
