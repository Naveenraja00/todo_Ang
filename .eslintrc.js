module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  plugins: ["import"],
  rules: {
    "import/order": ["error", { "alphabetize": { "order": "asc" } }]
  }
};
