import { Order, Inventory } from '../../../types/store';

export default class StoreApiAssertions {
  /**
   * Validates get inventory response
   */
  static validateGetInventoryResponse(resp: Cypress.Response<Inventory>) {
    expect(resp.status).to.equal(200);
    expect(resp.body).to.be.an('object');
    // Inventory has counts for statuses like available, pending, sold
    expect(resp.body).to.have.property('available');
    expect(resp.body).to.have.property('pending');
    expect(resp.body).to.have.property('sold');
  }

  /**
   * Validates place order response
   */
  static validatePlaceOrderResponse(resp: Cypress.Response<Order>, expectedOrder: Order) {
    expect(resp.status).to.equal(200);
    expect(resp.body.petId).to.equal(expectedOrder.petId);
    expect(resp.body.quantity).to.equal(expectedOrder.quantity);
    expect(resp.body.status).to.equal(expectedOrder.status);
  }

  /**
   * Validates get order response
   */
  static validateGetOrderResponse(resp: Cypress.Response<Order>, expectedOrder: Order) {
    expect(resp.status).to.equal(200);
    expect(resp.body.id).to.equal(expectedOrder.id);
    expect(resp.body.petId).to.equal(expectedOrder.petId);
  }

  /**
   * Validates delete order response
   */
  static validateDeleteOrderResponse(resp: Cypress.Response<{}>) {
    expect([200, 404]).to.include(resp.status);
  }
}