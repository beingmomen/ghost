// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'vue/no-multiple-template-root': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 3 }],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/indent-binary-ops': 'off',
    'no-console': 'warn',
    'no-debugger': 'error'
  }
});
