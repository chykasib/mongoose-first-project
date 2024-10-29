// eslint.config.mjs
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc'; // <--- Uncomment this line

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      jsdoc, // <--- Include the imported plugin
    },
    rules: {
      'jsdoc/require-description': 'error',
      'jsdoc/check-values': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
    },
  },
  {
    ignores: ['.node_modules/*'],
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
