const assetFormats = '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$';

module.exports = {
  transform: {
    '.(ts|tsx)': [
      'ts-jest',
      {
        isolatedModules: true
      }
    ]
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  moduleNameMapper: {
    [assetFormats]: '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
  },
  automock: false,
  resetMocks: false,
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.ts'
  ]
};
