module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true
  },
  'extends': ['plugin:vue/essential', 'eslint:recommended', 'plugin:vue/recommended'],
  'parserOptions': {
    'parser': 'babel-eslint'
  },
  'rules': {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
  }
}