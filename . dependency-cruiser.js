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
