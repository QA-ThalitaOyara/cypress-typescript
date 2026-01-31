import { PetBody } from "cypress/types/pet";

export default class PetApiAssertions {

  /**
   * Validates response status against allowed values
   */
  private static expectStatus(resp: Cypress.Response<PetBody>, allowed: number[]) {
    expect(resp.status, `Invalid status: ${resp.status}`).to.be.oneOf(allowed);
  }

  /**
   * Validates create pet response
   */
  static validateCreateResponse(resp: Cypress.Response<PetBody>, expectedPet: PetBody) {
    this.expectStatus(resp, [200, 201]);
    expect(resp.body.name, 'Pet name mismatch').to.equal(expectedPet.name);
  }

  /**
   * Validates get pet response
   */
  static validateGetResponse(resp: Cypress.Response<PetBody>, expectedPet: PetBody) {
    this.expectStatus(resp, [200]);
    expect(resp.body.name, 'Pet name mismatch').to.equal(expectedPet.name);
  }

  /**
   * Validates update pet response
   */
  static validateUpdateResponse(resp: Cypress.Response<PetBody>, updatedPet: PetBody) {
    this.expectStatus(resp, [200, 201]);
    expect(resp.body.name, 'Pet name mismatch after update').to.equal(updatedPet.name);
    expect(resp.body.status, 'Pet status mismatch after update').to.equal(updatedPet.status);
  }

  /**
   * Validates delete pet response
   */
  static validateDeleteResponse(resp: Cypress.Response<PetBody>) {
    this.expectStatus(resp, [200, 404]);
  }
}
