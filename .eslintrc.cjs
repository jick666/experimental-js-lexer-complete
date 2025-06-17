module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended"],
  plugins: [],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
  },
};
