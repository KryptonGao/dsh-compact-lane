import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    alias: {
      "@deepseek-ai/dsh-client-ui-primitives": new URL(
        "./tests/primitives-mock.tsx",
        import.meta.url,
      ).pathname,
    },
  },
  test: { include: ["tests/**/*.test.{ts,tsx}"], environment: "node" },
});
