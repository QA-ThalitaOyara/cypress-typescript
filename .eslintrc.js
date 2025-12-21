module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
    node: true,
    "cypress/globals": true
  },

  parser: "@typescript-eslint/parser",

  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },

  plugins: [
    "@typescript-eslint",
    "cypress",
    "cucumber",
    "import"
  ],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:cypress/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],

  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },

  rules: {
    // Organize imports
    "import/order": [
      "error",
      {
        "alphabetize": { order: "asc" }
      }
    ],

    // TypeScript
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",

    // Cypress
    "cypress/no-assigning-return-values": "off",
    "cypress/no-unnecessary-waiting": "warn",

    // Cucumber
    "cucumber/no-arrow-functions": "off"
  },

  overrides: [
    {
      files: ["**/*.feature"],
      parser: "eslint-plugin-cucumber/parser",
      rules: {
        "cucumber/no-unused-steps": "off"
      }
    }
  ]
};
