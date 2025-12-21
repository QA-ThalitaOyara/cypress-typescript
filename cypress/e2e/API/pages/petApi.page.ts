import { Pet } from '../../../types/pet';

export default class PetApi {

 private static request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: any
  ): Cypress.Chainable<Cypress.Response<T>> {
    return cy.api({
      method,
      url,
      body,
      failOnStatusCode: false
    }) as Cypress.Chainable<Cypress.Response<T>>;
  }

  static createPet(pet: Pet) {
    return this.request<Pet>('POST', '/v2/pet', pet);
  }

  static getPet(id: number) {
    return this.request<Pet>('GET', `/v2/pet/${id}`);
  }

  static updatePet(pet: Pet) {
    return this.request<Pet>('PUT', '/v2/pet', pet);
  }

  static deletePet(id: number) {
    return this.request<{}>('DELETE', `/v2/pet/${id}`);
  }

  static getPetsByStatus(status: string) {
    return this.request<Pet[]>('GET', `/v2/pet/findByStatus?status=${status}`);
  }
}
