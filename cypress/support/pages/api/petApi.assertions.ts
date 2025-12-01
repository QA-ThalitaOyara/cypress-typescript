export default class PetApiAssertions {

  private static expectStatus(resp: Cypress.PetResponse, allowed: number[]) {
    expect(resp.status, `Invalid status: ${resp.status}`).to.be.oneOf(allowed);
  }

  static validateCreateResponse(resp: Cypress.PetResponse, expectedPet: Cypress.Pet) {
    this.expectStatus(resp, [200, 201]);
    expect(resp.body.name, 'Pet name mismatch').to.equal(expectedPet.name);
  }

  static validateGetResponse(resp: Cypress.PetResponse, expectedPet: Cypress.Pet) {
    this.expectStatus(resp, [200]);
    expect(resp.body.name, 'Pet name mismatch').to.equal(expectedPet.name);
  }

  static validateUpdateResponse(resp: Cypress.PetResponse, updatedPet: Cypress.Pet) {
    this.expectStatus(resp, [200, 201]);
    expect(resp.body.name, 'Pet name mismatch after update').to.equal(updatedPet.name);
    expect(resp.body.status, 'Pet status mismatch after update').to.equal(updatedPet.status);
  }

  static validateDeleteResponse(resp: Cypress.PetResponse) {
    this.expectStatus(resp, [200, 404]);
  }
}
