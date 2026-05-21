import nextJest from "next/jest.js";

// next/jest gère la compilation TypeScript (via SWC) et l'alias "@/".
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/__tests__/**/*.test.ts"],
};

export default createJestConfig(config);
