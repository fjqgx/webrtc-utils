module.exports = {
  testEnvironment: 'jsdom',
  rootDir: './',
  preset: 'ts-jest',
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^._\\.(ts|tsx)?$': 'ts-jest',
    '^._\\.(js|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
};