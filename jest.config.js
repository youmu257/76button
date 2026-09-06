module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/unit/**/*.spec.js'],
  clearMocks: true,
  restoreMocks: true,
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg|mp3)$': '<rootDir>/tests/unit/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
