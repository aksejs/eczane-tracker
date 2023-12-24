module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb/rules/react',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: 'detect',
    },
    env: {
      node: true,
    },
    // Tells eslint how to resolve imports
    'import/resolver': {
      alias: {
        map: [['@app', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['./src/assets/'],
  globals: {
    React: true,
    google: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true,
    window: true,
  },
  rules: {
    // 'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    // 'jsx-a11y/click-events-have-key-events': 'off',
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'implicit-arrow-linebreak': 'off',
    // 'operator-linebreak': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
  },
};
