/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};

module.exports = config;
