# API Test Coverage Metrics

This document explains how API test coverage metrics are generated, tracked, and interpreted in this project.

---

## 📌 Overview

The project uses **Cypress + TypeScript + Cucumber** for API tests.
To quantify the quality and completeness of tests, we measure coverage at the **endpoint level**:

* **Critical coverage (`@coverage-critical`)**: Happy paths or main validations essential for the API functionality.
* **Additional coverage (`@coverage-additional`)**: Optional or exploratory scenarios that complement critical tests.
* **None**: Endpoints that are not yet covered by tests.

The coverage calculation is **based on feature tags** and the Swagger/OpenAPI schema.

---

## 🏗️ Tagging Conventions

### Endpoint tags

Each scenario should declare the endpoint it tests:

```
@endpoint-<METHOD>-<PATH>
```

Examples:

```gherkin
@endpoint-POST-/pet
@endpoint-GET-/pet/{petId}
```

### Domain / area tags

Indicate the functional area:

```
@domain-<domain_name>
```

Examples:

```gherkin
@domain-pet
@domain-user
```

### Coverage type

* `@coverage-critical` → main scenario, must be tested
* `@coverage-additional` → additional scenario
* `@coverage-full` → optional, can be treated as critical if needed

---

## ⚡ Running Coverage Metrics

1. Ensure the Swagger JSON is available locally at:

```
coverage/swagger.json
```

2. Run the coverage script:

```bash
ts-node scripts/generate-coverage.ts
```

3. Output:

* JSON report: `coverage/swagger-coverage.json`
* Optional PDF report: `coverage/swagger-coverage.pdf` (graphical summary)

---

## 📊 Interpreting the Report

### JSON

```json
{
  "metrics": {
    "totalEndpoints": 20,
    "endpointsWithTests": 12,
    "critical": 8,
    "additional": 4,
    "none": 8,
    "overallCoveragePercent": 60,
    "byTag": {
      "pet": { "total": 8, "critical": 5, "additional": 2, "none": 1 },
      "user": { "total": 8, "critical": 3, "additional": 2, "none": 3 }
    }
  }
}
```

* `totalEndpoints`: total endpoints in Swagger
* `endpointsWithTests`: endpoints covered by at least one test
* `critical` / `additional` / `none`: count per coverage type
* `overallCoveragePercent`: percentage of endpoints tested (critical + additional)
* `byTag`: coverage per functional domain

### PDF

* Pie chart of **Critical / Additional / None** endpoints
* Table with coverage per domain/tag

> The PDF provides a quick visual summary for team or stakeholder review.

---

## 🛠️ Maintaining Coverage

1. **Tag new scenarios** according to endpoint, domain, and coverage type.
2. **Update Swagger JSON** if new endpoints are added.
3. **Rerun coverage script** to generate updated JSON and PDF reports.
4. Monitor gaps (`none`) to prioritize test development.

---

## 📈 Best Practices

* Focus on **critical endpoints** first.
* Use **additional scenarios** to increase coverage and test edge cases.
* Keep **tags consistent** with Swagger paths.
* Automate PDF generation in **CI/CD** to track coverage over time.

---