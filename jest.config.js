const tsconfig = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  coveragePathIgnorePatterns: [
    'test-config',
    'interfaces',
    'index.ts',
    '.query.ts',
    '.db-port.ts',
  ],
  coverageDirectory: '../coverage',
};
