import path from "path";

export default {
  test: {
    globals: true,
    environment: "node",
    // Playwright owns the e2e folder, so vitest only runs unit tests.
    include: ["tests/**/*.test.ts"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
};
