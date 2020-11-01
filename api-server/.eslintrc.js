const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module", // Allows for the use of imports
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  env: {
      browser: true,
      commonjs: true,
      es2021: true,
      node: true
  },
  extends: [
      "plugin:@typescript-eslint/recommended",
      // Uses eslint-config-prettier to disable ESLint rules from 
      // @typescript-eslint/eslint-plugin that would conflict with prettier
      "prettier/@typescript-eslint", 
      // Enables eslint-plugin-prettier and eslint-config-prettier. This will 
      // display prettier errors as ESLint errors. Make sure this is always the
      // last configuration in the extends array.
      "plugin:prettier/recommended" 
  ],
  plugins: [
      "prettier"
  ],
  rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-non-null-assertion": "off"
  },
  }
};

module.exports = config;
