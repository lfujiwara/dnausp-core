const tsconfig = require('./tsconfig.json');
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  moduleNameMapper: Object.entries(tsconfig.compilerOptions.paths).reduce(
    (mapper, [key, value]) => {
      mapper[key] = value.map((path) => `<rootDir>/${path}`);
      return mapper;
    },
    {},
  ),
};
