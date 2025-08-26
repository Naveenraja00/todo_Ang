module.exports = {
  forbidden: [
    {
      name: "no-feature-to-app",
      comment: "Features must not depend on app/",
      from: { path: "^src/features" },
      to: { path: "^src/app" }
    },
    {
      name: "no-shared-to-features",
      comment: "Shared must not import from features/",
      from: { path: "^src/shared" },
      to: { path: "^src/features" }
    }
  ]
};

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    baseDir: ".",
    includeOnly: "src"
  },
  forbidden: [
    // shared must not import features or app
    {
      name: "no-shared-to-up",
      comment: "shared must not import features/app",
      severity: "error",
      from: { path: "^src/shared" },
      to: { path: "^src/(features|app)" }
    },
    // features must not import app
    {
      name: "no-features-to-app",
      comment: "features must not import app",
      severity: "error",
      from: { path: "^src/features" },
      to: { path: "^src/app" }
    }
  ]
};

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: false,
    tsconfigRootDir: __dirname,
    sourceType: "module",
    ecmaVersion: 2022
  },
  plugins: ["@typescript-eslint", "import", "boundaries"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  settings: {
    // So ESLint (plugins) understand TS path aliases
    "import/resolver": {
      typescript: { project: "./tsconfig.json" },
      node: { extensions: [".ts", ".tsx", ".js", ".json"] }
    },
    // ---- boundaries: define layers by alias/glob
    "boundaries/elements": [
      { "type": "app",      "pattern": "src/app/**" },
      { "type": "features", "pattern": "src/features/**" },
      { "type": "shared",   "pattern": "src/shared/**" }
    ],
  },
  rules: {
    // ----- General sanity
    "import/no-unresolved": "error",
    "import/no-cycle": "error",
    "import/order": ["warn", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true },
      "pathGroups": [
        { "pattern": "@app/**", "group": "internal", "position": "after" },
        { "pattern": "@features/**", "group": "internal", "position": "after" },
        { "pattern": "@shared/**", "group": "internal", "position": "after" }
      ],
      "pathGroupsExcludedImportTypes": ["builtin"]
    }],

    // ----- Architecture: boundaries
    // allowed directions:
    // - app -> features, shared
    // - features -> shared (and same feature)
    // - shared -> (no upward deps)
    "boundaries/entry-point": "off", // not needed unless you restrict index files
    "boundaries/allowed-types": [ "error", {
      default: "disallow",
      rules: [
        // app can import from features & shared
        { from: "app",      allow: ["features", "shared", "app"] },
        // features can import from shared and same feature
        { from: "features", allow: ["shared", "features"] },
        // shared can import only from shared
        { from: "shared",   allow: ["shared"] },
      ]
    }],

    // ----- Fallback (extra safety) using paths. Keep both if you like.
    // Prevent shared importing features/app via path aliases
    "no-restricted-imports": ["error", {
      "patterns": [
        { "group": ["@features/*", "@app/*"], "message": "shared cannot import from features/app", "target": ["src/shared/**"] },
        { "group": ["@app/*"], "message": "features cannot import from app", "target": ["src/features/**"] }
      ]
    }],
  },
  overrides: [
    // Tests: relax certain rules if needed
    {
      files: ["**/*.test.ts", "**/__tests__/**/*.ts"],
      rules: {
        "import/no-extraneous-dependencies": "off"
      }
    }
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "coverage/"
  ]
};
