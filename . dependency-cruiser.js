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
