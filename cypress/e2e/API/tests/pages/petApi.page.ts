export default class PetApi {

  static createPet(pet: Cypress.Pet): Cypress.Chainable<Cypress.PetResponse> {
    return cy.request({
      method: 'POST',
      url: `/v2/pet`,
      body: pet,
      failOnStatusCode: false
    });
  }

  static getPet(id: number): Cypress.Chainable<Cypress.PetResponse> {
    return cy.request({
      method: 'GET',
      url: `/v2/pet/${id}`,
      failOnStatusCode: false
    });
  }

  static updatePet(pet: Cypress.Pet): Cypress.Chainable<Cypress.PetResponse> {
    return cy.request({
      method: 'PUT',
      url: `/v2/pet`,
      body: pet,
      failOnStatusCode: false
    });
  }

  static deletePet(id: number): Cypress.Chainable<Cypress.PetResponse> {
    return cy.request({
      method: 'DELETE',
      url: `/v2/pet/${id}`,
      failOnStatusCode: false
    });
  }
}
