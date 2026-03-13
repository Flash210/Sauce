module.exports = {
  default: {
    // ── Source files ───────────────────────────────────────────
    paths: ["tests/bdd/features/**/*.feature"],
    require: [
      "tests/bdd/support/world.ts",
      "tests/bdd/support/hooks.ts",
      "tests/bdd/step-definitions/**/*.ts",
    ],
    // ── TypeScript loader ──────────────────────────────────────
    requireModule: ["ts-node/register"],
    // ── Reporters ─────────────────────────────────────────────
    format: [
      "progress-bar",                          // compact console output
      "html:cucumber-report.html",             // self-contained HTML report
      "json:cucumber-report.json",             // machine-readable JSON
    ],
    formatOptions: { snippetInterface: "async-await" },
    // ── Execution ─────────────────────────────────────────────
    parallel: 1,
    retry: 1,
  },
};
