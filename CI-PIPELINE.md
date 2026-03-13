# 🎭 GitHub CI Pipeline — Playwright Automation Suite

This document explains the GitHub Actions CI pipeline for this Playwright test project targeting [SauceDemo](https://www.saucedemo.com).

---

## 📁 Workflows Structure

```
.github/
└── workflows/
    ├── ci.yml       ← runs on push / pull_request
    └── nightly.yml  ← runs every night at 00:00 UTC
```

> Two separate files with a single responsibility each — no conditional `if` guards needed.

---

## 🗂️ Project Structure (Reference)

```
├── .github/
│   └── workflows/
│       ├── ci.yml               # CI pipeline for push/PR
│       └── nightly.yml          # Nightly pipeline
├── tests/
│   ├── saucedemo.spec.ts        # Cart tests
│   ├── checkout.spec.ts         # Checkout tests
│   ├── sorting.spec.ts          # Sorting tests
│   ├── hooks.ts                 # beforeEach / afterEach hooks (login + screenshots)
│   ├── fixture/
│   │   └── testdata.json        # Test credentials & data
│   ├── locators/                # Page locators
│   └── pages/
│       ├── LoginPage.ts
│       ├── InventoryPage.ts
│       ├── CartPage.ts
│       ├── CheckoutPage.ts
│       └── SortingPage.ts
├── playwright.config.ts         # Playwright configuration
├── package.json
└── CI-PIPELINE.md               # This file
```

---

## ⚙️ Pipeline Overview

```
Push / PR to main, master, develop        Schedule (00:00 UTC) / Manual
            │                                          │
            ▼                                          ▼
     ┌─────────────┐                         ┌──────────────────┐
     │   ci.yml    │                         │   nightly.yml    │
     │ timeout 30m │                         │  timeout  60m    │
     │ retain 30d  │                         │  retain   60d    │
     └─────────────┘                         │  + failure alert │
                                             └──────────────────┘
  Each file runs 3 browser jobs in parallel:
  ┌──────────┐ ┌─────────┐ ┌──────┐
  │ chromium │ │ firefox │ │webkit│
  └──────────┘ └─────────┘ └──────┘
```

---

## 🔔 Triggers

### `ci.yml`
```yaml
on:
  push:
    branches: [main, master, develop]
  pull_request:
    branches: [main, master, develop]
  workflow_dispatch:
```

| Trigger | When it fires |
|---|---|
| `push` | Every commit pushed to `main`, `master`, or `develop` |
| `pull_request` | Every PR targeting those branches |
| `workflow_dispatch` | Manual trigger from the GitHub Actions UI |

### `nightly.yml`
```yaml
on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
```

| Trigger | When it fires |
|---|---|
| `schedule` | Every night at **00:00 UTC** |
| `workflow_dispatch` | Manual trigger from the GitHub Actions UI |

---

## 🖥️ Runner & Timeout

| | `ci.yml` | `nightly.yml` |
|---|---|---|
| **Runner** | `ubuntu-latest` | `ubuntu-latest` |
| **Timeout** | 30 minutes | 60 minutes |

---

## 🔀 Matrix Strategy (Parallel Browsers)

Both workflows share the same matrix:

```yaml
strategy:
  fail-fast: false
  matrix:
    browser: [chromium, firefox, webkit]
```

| Key | Explanation |
|---|---|
| `fail-fast: false` | All 3 browser jobs run even if one fails |
| `matrix.browser` | Spins up **3 parallel runners**, one per browser |

This mirrors the three projects in `playwright.config.ts`:
```ts
projects: [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "firefox",  use: { ...devices["Desktop Firefox"] } },
  { name: "webkit",   use: { ...devices["Desktop Safari"] } },
]
```

---

## 🪜 Shared Steps (Both Workflows)

Both `ci.yml` and `nightly.yml` run the same core steps:

### Step 1 — 📥 Checkout Repository
```yaml
- uses: actions/checkout@v4
```
Clones the repo so all test files, configs, and fixtures are available.

---

### Step 2 — 🟢 Setup Node.js
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: "npm"
```
- Installs **Node.js 20 LTS** required by `@playwright/test ^1.58`.
- `cache: "npm"` speeds up repeat runs by caching `~/.npm`.

---

### Step 3 — 📦 Install Dependencies
```yaml
- run: npm ci
```
`npm ci` is deterministic (uses `package-lock.json`), cleans `node_modules` first, and is faster than `npm install` in CI.

---

### Step 4 — 🌐 Install Playwright Browsers
```yaml
- run: npx playwright install --with-deps ${{ matrix.browser }}
```
- `--with-deps` installs required OS-level libraries (fonts, codecs) on Linux.
- Only the **one browser** for that matrix runner is downloaded.

> ⚠️ Without `--with-deps`, browsers often fail to launch on headless Ubuntu runners.

---

### Step 5 — 🎭 Run Playwright Tests
```yaml
- run: npx playwright test --project=${{ matrix.browser }}
  env:
    CI: true
```
`CI: true` activates these settings from `playwright.config.ts`:
```ts
forbidOnly: !!process.env.CI,    // fail if test.only is left in code
retries: process.env.CI ? 2 : 0, // retry failed tests twice
workers: process.env.CI ? 1 : undefined, // single worker
```

---

### Step 6 — 📊 Upload HTML Report
```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report-${{ matrix.browser }}   # ci.yml
    name: nightly-report-${{ matrix.browser }}      # nightly.yml
    path: playwright-report/
    retention-days: 30   # ci.yml  |  60 — nightly.yml
```
- `if: always()` — uploads even when tests fail.
- Self-contained interactive HTML site with results, traces, and screenshots.

---

### Step 7 — 📸 Upload Test Results (Screenshots & Videos)
```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results-${{ matrix.browser }}    # ci.yml
    name: nightly-results-${{ matrix.browser }} # nightly.yml
    path: test-results/
    retention-days: 30   # ci.yml  |  60 — nightly.yml
```

| File type | When captured |
|---|---|
| **Screenshots** (`*.png`) | Every test (hook) + on failure (config) |
| **Videos** (`*.webm`) | Retained on failure |
| **Error context** (`*.md`) | On failure (Playwright automatic) |

---

## 🌙 Nightly-only Step — 🔔 Failure Notification

```yaml
- name: 🔔 Notify on Nightly Failure
  if: failure()
  run: |
    echo "::error::🌙 Nightly tests FAILED on ${{ matrix.browser }}. Check the artifacts for screenshots and videos."
```
- Runs only when a previous step **failed**.
- The `::error::` command creates a visible **red annotation** on the Actions run page.
- Extend it to Slack/Teams by replacing `echo` with a `curl` webhook:

```yaml
- name: 🔔 Slack Notification on Nightly Failure
  if: failure()
  run: |
    curl -X POST -H 'Content-type: application/json' \
    --data '{"text":"🌙 Nightly Playwright tests FAILED on ${{ matrix.browser }}!"}' \
    ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

### Cron Schedule Reference

```
┌─────────── minute        (0)
│ ┌───────── hour          (0 = midnight UTC)
│ │ ┌─────── day of month  (* = every day)
│ │ │ ┌───── month         (* = every month)
│ │ │ │ ┌─── day of week   (* = every day)
│ │ │ │ │
0 0 * * *
```

| Cron | Meaning |
|---|---|
| `0 0 * * *` | Every day at midnight UTC ✅ (current) |
| `0 2 * * *` | Every day at 02:00 UTC |
| `0 0 * * 1` | Every Monday at midnight UTC |
| `0 0 * * 1-5` | Every weekday (Mon–Fri) at midnight UTC |
| `0 0 1 * *` | First day of every month at midnight UTC |

---

## 📦 Artifacts — Where to Find Them

```
GitHub → Your Repo → Actions → [workflow run] → Artifacts (bottom of page)
```

```
# ci.yml artifacts (30-day retention)
playwright-report-chromium
playwright-report-firefox
playwright-report-webkit
test-results-chromium
test-results-firefox
test-results-webkit

# nightly.yml artifacts (60-day retention)
nightly-report-chromium
nightly-report-firefox
nightly-report-webkit
nightly-results-chromium
nightly-results-firefox
nightly-results-webkit
```

---

## 🔐 Secrets & Credentials

Credentials live in `tests/fixture/testdata.json`. For production, move them to **GitHub Secrets**:

1. **Settings → Secrets and variables → Actions → New repository secret**
2. Add `SAUCE_USERNAME` and `SAUCE_PASSWORD`
3. Use them in the workflow:

```yaml
env:
  CI: true
  SAUCE_USERNAME: ${{ secrets.SAUCE_USERNAME }}
  SAUCE_PASSWORD: ${{ secrets.SAUCE_PASSWORD }}
```

4. Read them in `hooks.ts`:
```ts
await loginPage.login(
  process.env.SAUCE_USERNAME ?? data.credentials.username,
  process.env.SAUCE_PASSWORD ?? data.credentials.password
);
```

---

## 🚦 Pipeline Status Badge

```md
![CI](https://github.com/<YOUR_USERNAME>/<YOUR_REPO>/actions/workflows/ci.yml/badge.svg)
![Nightly](https://github.com/<YOUR_USERNAME>/<YOUR_REPO>/actions/workflows/nightly.yml/badge.svg)
```

---

## ✅ Summary

| What | `ci.yml` | `nightly.yml` |
|---|---|---|
| **Runner OS** | `ubuntu-latest` | `ubuntu-latest` |
| **Node version** | `20` | `20` |
| **Browsers** | Chromium, Firefox, WebKit | Chromium, Firefox, WebKit |
| **Trigger** | push / pull_request / manual | schedule 00:00 UTC / manual |
| **Timeout** | 30 min | 60 min |
| **Retries** | 2 | 2 |
| **Workers** | 1 | 1 |
| **Artifact retention** | 30 days | 60 days |
| **Failure notification** | ❌ | ✅ GitHub error annotation |
| **Fails on `test.only`** | ✅ | ✅ |
