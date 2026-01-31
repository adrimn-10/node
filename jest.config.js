/** @type {import('jest').Config} */
export default {
  verbose: true,
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  transform: {},

  // Cobertura mínima obligatoria para CI
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
