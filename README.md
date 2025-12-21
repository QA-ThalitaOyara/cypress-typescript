# Cypress + TypeScript (Cucumber) Test Suite

End-to-end tests using Cypress, TypeScript, and Cucumber (Gherkin). Tests organized by domain (API and GUI).

---

## Prerequisites

- Node.js (v16+ recommended)
- npm (or yarn)

## Install

Install dependencies:

```powershell
npm install
```

## Useful npm scripts

- `npm run lint` — run ESLint on the TypeScript files
- `npm run lint:fix` — run ESLint and fix fixable issues
- `npm run lint:ts` — run `tsc --noEmit` (TypeScript type-check)
- `npm run cypress:open` — open Cypress Test Runner (interactive)
- `npm run cypress:run` — run tests headless
- `npm run petStore-api-coverage` — generate API coverage metrics (see [README-APICOVERAGE.md](README-APICOVERAGE.md))
- `npm run generatePdfReport` — generate PDF coverage report
- `npm test` — run lint and headless tests



---

## Project structure

```
cypress/
├── e2e/
│   ├── api/              — API tests
│   │   ├── features/     — .feature files
│   │   ├── pages/        — page objects
│   │   ├── stepDefinitions/  — step implementations
│   │   └── builders/     — test data builders (optional)
│   ├── gui/              — GUI tests
│   │   ├── features/
│   │   ├── pages/
│   │   └── stepDefinitions/
│   ├── fixtures/         — test data
│   ├── support/          — Cypress support (commands, setup)
│   └── types/            — TypeScript types
├── cypress.config.ts
├── package.json
└── tsconfig.json
```

---

## TypeScript path aliases

Convenient import aliases in `tsconfig.json`:

- `@api/*` → `cypress/e2e/api/*`
- `@gui/*` → `cypress/e2e/gui/*`
- `@support/*` → `cypress/support/*`

---

## Architecture

**Page Objects**: Encapsulate selectors and actions per domain (API/GUI). Avoid assertions.

**Step Definitions**: Map Gherkin steps to page object methods. Keep readable and simple.

**Builders**: Optional; use for test data construction.

---

## Feature Files & Tagging

Step definitions are auto-discovered from `cypress/e2e/**/*.steps.ts`.

For API coverage metrics, see [README.API-COVERAGE.md](README.API-COVERAGE.md) for tagging conventions (`@<METHOD>-<PATH>`, `@domain-*`, `@coverage-*`).

---

## API Coverage

Automated API coverage metrics available. See [README.API-COVERAGE.md](README.API-COVERAGE.md).

```powershell
npm run petStore-api-coverage     # Generate JSON report
npm run generatePdfReport         # Generate PDF report
```

---

## Workflow

1. Write feature files (`.feature`) with Gherkin scenarios
2. Implement page objects under `cypress/e2e/{api|gui}/pages/`
3. Implement step definitions under `cypress/e2e/{api|gui}/stepDefinitions/`
4. Run tests: `npm run cypress:run` or `npm run cypress:open` (interactive)

**Best practices:**
- Keep page objects focused; avoid assertions
- Keep step definitions readable and simple
- Run linters before committing: `npm run lint && npm run lint:ts`

---

## Technology Stack

* **Cypress** v14.4.0 — end-to-end test framework
* **TypeScript** 5.4.2 — type-safe test code
* **Cucumber (Gherkin)** — BDD-style scenario language
* **@badeball/cypress-cucumber-preprocessor** — Gherkin integration
* **esbuild** — fast TypeScript bundler
* **ESLint** — code quality checks
* **Chart.js & Puppeteer** — coverage report generation (PDF)
