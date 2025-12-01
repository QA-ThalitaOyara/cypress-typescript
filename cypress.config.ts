import path from 'path';

import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
  
      await addCucumberPreprocessorPlugin(on, config);
  
      on('file:preprocessor', createBundler({ 
        target: 'es2022',
        sourcemap: 'inline',
        plugins: [createEsbuildPlugin(config)] 
      }));
      return config;
    },

    baseUrl: 'https://petstore.swagger.io',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile:  path.resolve('cypress/support/e2e.ts'),
    fixturesFolder: 'cypress/fixtures',
    downloadsFolder: 'cypress/downloads',
  
    video: false,
    screenshotOnRunFailure: true,
  
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 20000,
  },
});