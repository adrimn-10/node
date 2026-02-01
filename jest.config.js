/** @type {import('jest').Config} */
export default {
  verbose: true,
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  transform: {},


  coverageThreshold: {
    global: {
      branches: 50,      
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
