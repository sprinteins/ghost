module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  plugins: ['react', 'jsx-a11y', 'import'],
  rules: {
    radix: [2, 'as-needed'],
  },
  env: {
    browser: true,
  },
};
