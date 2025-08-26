/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ],
  plugins: ['unused-imports', 'simple-import-sort', 'prettier'],
  rules: {
    /* unused imports/vars */
    'unused-imports/no-unused-imports': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ],

    /* imports */
    'import/no-unresolved': 'off',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',

    /* Vue */
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/no-side-effects-in-computed-properties': 'warn',
    'vue/valid-v-slot': 'warn',
    'vue/no-mutating-props': 'warn',
    'vue/no-v-text-v-html-on-component': 'warn',
    'vue/html-self-closing': [
      'warn',
      {
        html: { void: 'always', normal: 'never', component: 'always' },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/attribute-hyphenation': ['warn', 'always'],
    'vue/component-name-in-template-casing': ['warn', 'PascalCase'],

    /* TypeScript */
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',

    /* JS base */
    'no-useless-catch': 'warn',
    'no-useless-escape': 'warn',
    'no-unused-expressions': ['warn', { allowShortCircuit: true, allowTernary: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',

    /* Prettier */
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        tabWidth: 2,
        singleQuote: true,
        printWidth: 100,
        trailingComma: 'none',
        bracketSpacing: true,
        endOfLine: 'auto'
      }
    ]
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.vue', '.json']
      }
    }
  }
}
