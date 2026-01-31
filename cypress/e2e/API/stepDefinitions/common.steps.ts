import { When } from '@badeball/cypress-cucumber-preprocessor';

// Common steps for all domains

/**
 * Stores the user ID from the last response in Cypress context
 */
When('I store the response user ID in context', () => {
  cy.get<Cypress.Response<any>>('@lastResponse').then((resp) => {
    cy.wrap(resp.body.id).as('userId');
  });
});

/**
 * Stores the order ID from the last response in Cypress context
 */
When('I store the response order ID in context', () => {
  cy.get<Cypress.Response<any>>('@lastResponse').then((resp) => {
    cy.wrap(resp.body.id).as('orderId');
  });
});