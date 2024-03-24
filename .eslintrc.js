module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
    'import',
    'unused-imports',
    'prettier',
    'sort-class-members',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],

  rules: {
    'sort-class-members/sort-class-members': [
      2,
      {
        order: [
          '[static-properties]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]',
          '[static-methods]',
        ],
        accessorPairPositioning: 'getThenSet',
      },
    ],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'no-duplicate-imports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Internal packages
          ['^\\w'],
          ['^\\u0000'],

          // Nest packages.
          ['^@?nest'],
          ['^\\u0000'],

          // bootstrap files
          ['^@?bootstrap'],
          ['^\\u0000'],

          // General files
          ['^@?common'],
          ['^\\u0000'],

          // Modules
          ['^@?modules'],
          ['^\\u0000'],

          // generated files
          ['^@?generated'],
          ['^\\u0000'],

          // anything start with @
          ['^@?\\w'],
          ['^\\u0000'],

          // anything start with src
          ['^src'],
          ['^\\u0000'],

          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'max-statements-per-line': ['error', { max: 1 }],
    'no-console': 'error',
    'unused-imports/no-unused-imports': 'error',
    eqeqeq: 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
