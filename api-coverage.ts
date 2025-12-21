import fs from 'fs';
import { sync as globSync } from 'glob';

// ---------- Config ----------
const FEATURES_DIR = 'cypress/e2e/api/**/*.feature';
const SWAGGER_PATH = 'coverage/petstore-swagger.json';
const FALLBACK_SWAGGER = 'coverage/api-coverage.json';
const OUTPUT_DIR = 'coverage';
const OUTPUT_PATH = `${OUTPUT_DIR}/api-coverage.json`;

// ---------- Helpers ----------
const normalizePath = (p: string) => (p.startsWith('/') ? p : '/' + p).replace(/\\+/g, '/');

function parseFeatureTags(content: string): string[][] {
  const regex = /((?:@[^{\n\r]+\s*)+)\s*Scenario:/gm;
  const scenarios: string[][] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content))) {
    const tags = m[1].match(/@[\w\-:\/{}]+/g);
    if (tags) scenarios.push(tags.map(t => t.trim()));
  }
  return scenarios;
}

// ---------- Step 1 Parse features ----------
const featureFiles = globSync(FEATURES_DIR);
const testCoverageMap: Record<string, { tag?: string; critical?: boolean; additional?: boolean }> = {};

featureFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  parseFeatureTags(content).forEach(tags => {
    const domainTag = tags.find(t => t.startsWith('@domain-'))?.replace('@domain-', '');
    const isCritical = tags.includes('@coverage-critical');
    const isAdditional = tags.includes('@coverage-additional');
    const endpointTag = tags.find(t => /^@[A-Z]+-/.test(t));
    if (!endpointTag) return;

    const [method, ...pathParts] = endpointTag.replace('@', '').split('-');
    const normalized = normalizePath(pathParts.join('-'));
    const key = `${method.toUpperCase()} ${normalized}`;

    testCoverageMap[key] = testCoverageMap[key] || {};
    if (domainTag) testCoverageMap[key].tag = domainTag;
    if (isCritical) testCoverageMap[key].critical = true;
    if (isAdditional) testCoverageMap[key].additional = true;
  });
});

// ---------- Step 2️ Load Swagger ----------
let swaggerPath = fs.existsSync(SWAGGER_PATH) ? SWAGGER_PATH : FALLBACK_SWAGGER;
if (!fs.existsSync(swaggerPath)) throw new Error('Swagger JSON not found');

const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
const endpoints: any[] = [];
const coverageMap: Record<string, any> = {};

// ---------- Step 3️ Build coverage ----------
if (swagger.paths) {
  const paths = swagger.paths as Record<string, Record<string, any>>;
  for (const [p, methods] of Object.entries(paths)) {
    for (const [m, op] of Object.entries(methods)) {
      const method = m.toUpperCase();
      const normalizedPath = normalizePath(p);
      const key = `${method} ${normalizedPath}`;
      const coverageData = testCoverageMap[key];
      const finalTag = coverageData?.tag || (op.tags?.[0] || 'default');

      let coverageLevel: 'NONE' | 'ADDITIONAL' | 'CRITICAL' = 'NONE';
      if (coverageData) coverageLevel = coverageData.critical ? 'CRITICAL' : coverageData.additional ? 'ADDITIONAL' : 'NONE';

      endpoints.push({ path: normalizedPath, method, tag: finalTag, operationId: op.operationId || null });

      coverageMap[key] = {
        tag: finalTag,
        method,
        path: p,
        operationId: op.operationId || null,
        coverage: coverageLevel,
        testedBy: coverageData ? ['feature'] : [],
        assertions: null
      };
    }
  }
}

// ---------- Step 4️ Compute metrics ----------
const byTag: Record<string, any> = {};
let total = 0, criticalCount = 0, additionalCount = 0, noneCount = 0;

Object.values(coverageMap).forEach(entry => {
  total += 1;
  const tag = entry.tag || 'default';
  byTag[tag] = byTag[tag] || { total: 0, critical: 0, additional: 0, none: 0 };
  byTag[tag].total += 1;

  if (entry.coverage === 'CRITICAL') { byTag[tag].critical++; criticalCount++; }
  else if (entry.coverage === 'ADDITIONAL') { byTag[tag].additional++; additionalCount++; }
  else { byTag[tag].none++; noneCount++; }
});

const overallCoveragePercent = total ? Math.round(((criticalCount + additionalCount) / total) * 10000) / 100 : 0;

// ---------- Step 5️ Output ----------
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify({
  generatedAt: new Date().toISOString(),
  swaggerSource: 'https://petstore.swagger.io/v2/swagger.json',
  endpoints,
  coverageMap,
  metrics: {
    totalEndpoints: total,
    endpointsWithTests: criticalCount + additionalCount,
    critical: criticalCount,
    additional: additionalCount,
    none: noneCount,
    overallCoveragePercent,
    byTag
  }
}, null, 2));

console.log('✅ Swagger coverage report generated at', OUTPUT_PATH);
