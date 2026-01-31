import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Order } from '../../../types/store';
import { OrderBuilder } from '../builders/orderBuilder';
import StoreApi from '../pages/storeApi.page';
import StoreApiAssertions from '../assertions/storeApi.assertions';

/**
 * Creates a new order payload
 */
Given('I have a new order payload', () => {
  const order = new OrderBuilder()
    .withPetId(1)
    .withQuantity(1)
    .withStatus('placed')
    .build();
  cy.wrap(order).as('order');
});

/**
 * Places the order via API
 */
When('I place the order via API', () => {
  cy.get<Order>('@order').then((order) => {
    StoreApi.placeOrder(order).as('lastResponse');
  });
});

/**
 * Validates the place order response
 */
Then('the place order response should contain the order details', () => {
  cy.get<Cypress.Response<Order>>('@lastResponse').then((resp) => {
    cy.get<Order>('@order').then((order) => {
      StoreApiAssertions.validatePlaceOrderResponse(resp, order);
      cy.wrap(resp.body.id).as('orderId');
    });
  });
});

/**
 * Retrieves the order by ID via API
 */
When('I retrieve the order by ID via API', () => {
  cy.get<number>('@orderId').then((orderId) => {
    StoreApi.getOrderById(orderId).as('lastResponse');
  });
});

/**
 * Validates the retrieved order details
 */
Then('the returned order should have the same details', () => {
  cy.get<Cypress.Response<Order>>('@lastResponse').then((resp) => {
    cy.get<Order>('@order').then((order) => {
      StoreApiAssertions.validateGetOrderResponse(resp, order);
    });
  });
});

/**
 * Gets the store inventory via API
 */
When('I get the store inventory via API', () => {
  StoreApi.getInventory().as('lastResponse');
});

/**
 * Validates the inventory response
 */
Then('the inventory response should contain status counts', () => {
  cy.get<Cypress.Response<any>>('@lastResponse').then((resp) => {
    StoreApiAssertions.validateGetInventoryResponse(resp);
  });
});

/**
 * Deletes the order via API
 */
When('I delete the order via API', () => {
  cy.get<number>('@orderId').then((orderId) => {
    StoreApi.deleteOrder(orderId).as('lastResponse');
  });
});

/**
 * Validates the delete order response
 */
Then('the delete order call should return success or not found', () => {
  cy.get<Cypress.Response<{}>>('@lastResponse').then((resp) => {
    StoreApiAssertions.validateDeleteOrderResponse(resp);
  });
});