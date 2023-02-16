module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: {},
      alias: {
        map: [
          ['@', './src']
        ],
      },
    },
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'setupTests.ts',
          'test.{ts,tsx}',
          'test-*.{ts,tsx}',
          '**/*{.,_}{test,spec}.{ts,tsx}',
          '**/jest.config.ts',
          '**/jest.setup.ts'
        ],
        optionalDependencies: false
      }
    ],
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'react/jsx-filename-extension': 0,
    'comma-dangle': 0,
    'no-param-reassign': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'object-curly-newline': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-props-no-spreading': 0,
    'react/button-has-type': 0,
    'no-restricted-exports': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'react/jsx-one-expression-per-line': 0,
    'no-plusplus': 0,
    'max-len': [
      1,
      120,
      2,
      {
        ignoreComments: true
      }
    ],
  },
  ignorePatterns: ['webpack/*', 'src/dev/*', 'webpack.*.js'],
};
