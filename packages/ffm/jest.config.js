const baseJestConfig = require('../../jest.config');

module.exports = {
  ...baseJestConfig,
};

// jest.config.js
module.exports = {
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svgMock.js"
  }
};
