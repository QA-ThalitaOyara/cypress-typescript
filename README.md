# Cypress + TypeScript (Cucumber) Test Suite

This repository contains end-to-end tests written with Cypress and TypeScript using the Cucumber (Gherkin) feature files. Tests are split into API and GUI domains and use page objects (now under `cypress/support/pages`) and step definitions under `cypress/e2e`.

This README documents how to run the tests, the project layout, and the typing/import conventions used in this project.

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
- `npm test` — run lint and run headless tests

Examples

```powershell
# Open the interactive runner
npm run cypress:open

# Run all feature specs headless
npm run cypress:run

# Run only API features
npm run cypress:run -- --spec "cypress/e2e/api/**"

# Run only GUI features
npm run cypress:run -- --spec "cypress/e2e/gui/**"
```

---

## Project structure (high level)

- `cypress/`
  - `e2e/`
    - `api/`
      - `features/` — `.feature` files (Gherkin)
      - `stepDefinitions/` — step implementations (`*.steps.ts`)
    - `gui/`
      - `features/`
      - `stepDefinitions/`
  - `support/`
    - `pages/` — page objects and helpers (moved here; organized by domain: `api/` and `gui/`)
    - `commands.ts`, `e2e.ts` — Cypress support setup
  - `fixtures/` — test data
  - `models/` — global TypeScript declarations

Key files in this repository:

- `cypress/support/pages/api/petApi.page.ts` — typed API helpers that call `cy.api()` and return `Cypress.Chainable<Cypress.PetResponse>`
- `cypress/support/pages/gui/petUi.page.ts` — typed UI page object helpers that wrap UI selectors
- `cypress/e2e/api/stepDefinitions/petstore.steps.ts` — API step definitions
- `cypress/e2e/gui/stepDefinitions/petstore_ui.steps.ts` — GUI step definitions
- `cypress/models/types/pet.d.ts` — global `Cypress.Pet` and `Cypress.PetResponse` type aliases

---

## TypeScript path aliases

This project defines convenient import aliases in `tsconfig.json`:

- `@api/*` → `cypress/support/pages/api/*`
- `@gui/*` → `cypress/support/pages/gui/*`
- `@support/*` → `cypress/support/*`

Examples of usage in tests:

```ts
import PetApi from '@api/petApi.page';
import PetUi from '@gui/petUi.page';
```

These aliases keep imports short and stable when files move within the `support/pages` area.

---

## Cucumber preprocessor & step discovery

- The project uses `@badeball/cypress-cucumber-preprocessor` with `specPattern: 'cypress/e2e/**/*.feature'` (see `cypress.config.ts`).
- Step definition discovery is configured in `package.json` under `cypress-cucumber-preprocessor.stepDefinitions` (glob: `cypress/e2e/**/*.steps.ts`).

If you move or add step definition files, ensure they match that glob.

---

## Cypress configuration highlights

- `baseUrl` is set to the public Swagger Petstore: `https://petstore.swagger.io` (see `cypress.config.ts`).
- The project uses `cypress-plugin-api` and calls `cy.api()` in the API page object.
- Support file is `cypress/support/e2e.ts` (configured in `cypress.config.ts`).

---

## Recommended workflow

1. Run linters and type-check: `npm run lint && npm run lint:ts`
2. Run the specific feature you are working on using the `--spec` flag for faster iteration.
3. Use the interactive runner (`npm run cypress:open`) to debug selectors and page behavior.

---
# Cypress + Cucumber + TypeScript

This project is scaffolded to use `cypress` v14.4.0 with the `@badeball/cypress-cucumber-preprocessor` and `esbuild` bundler.
