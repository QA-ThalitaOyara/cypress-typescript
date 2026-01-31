// This file is processed and loaded automatically before your test files.
// You can put global configuration and behavior that modifies Cypress here.

import './commands'
import '@bahmutov/cy-api';

// Import CustomWorld to ensure it's registered with Cucumber
import { CustomWorld } from '../e2e/api/common/scenarioContext';