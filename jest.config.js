module.exports = {
  preset: 'react-native',
  collectCoverage: true,
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.js$': '../../node_modules/react-native/jest/preprocessor.js',
  },
  setupFiles: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community/google-signin|@react-native-community/picker|reactjs-popup)',
  ],
  
  moduleNameMapper: {
    "\\.(css|scss)$": "@homzhub/common/__mocks__/StyleMock.js"
  },

  coveragePathIgnorePatterns: ['/node_modules/', '/jest', '/src/mocks/', '/src/assets/'],
  testPathIgnorePatterns: ['/dist/'], // ignores dist folder while running test cases
  coverageReporters: ['json', 'lcov', 'text'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.tsx',
    '<rootDir>/src/**/interfaces.ts',
    '<rootDir>/src/**/Interfaces.ts',
    '!<rootDir>/src/assets/*',
    '!<rootDir>/src/constants/*',
    '!<rootDir>/src/mocks/**./*.{ts,tsx}',
    '!<rootDir>/src/styles/*',
    '!<rootDir>/src/domain/models/*',
    '!<rootDir>/src/**/*.native.ts',
    '!<rootDir>/src/**/*.web.ts',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/**/*.d.ts',
  ],
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
  globals: {
    'babel-jest': {
      isolatedModules: true,
    },
  },
};

process.env = Object.assign(process.env, {
  REACT_APP_API_BASE_URL: 'https://testbaseurl.com',
  REACT_APP_PLACES_API_BASE_URL: 'https://testbaseurl.com',
  REACT_APP_PLACES_API_KEY: 'test',
  REACT_APP_RAZOR_API_KEY: 'razorpay',
  REACT_APP_OTP_LENGTH: 6,
  REACT_APP_STORAGE_SECRET: 'secret',
  REACT_APP_YOUTUBE_API_KEY: 'youtube',
});
