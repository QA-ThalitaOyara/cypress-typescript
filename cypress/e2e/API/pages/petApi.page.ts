import { PetBody } from '../../../types/pet';

export default class PetApi {

 private static request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: PetBody
  ): Cypress.Chainable<Cypress.Response<T>> {
    return cy.api({
      method,
      url,
      body,
      failOnStatusCode: false
    }) as Cypress.Chainable<Cypress.Response<T>>;
  }

  static createPet(pet: PetBody) {
    return this.request<PetBody>('POST', '/v2/pet', pet);
  }

  static getPet(id: number) {
    return this.request<PetBody>('GET', `/v2/pet/${id}`);
  }

  static updatePet(pet: PetBody) {
    return this.request<PetBody>('PUT', '/v2/pet', pet);
  }

  static deletePet(id: number) {
    return this.request<{}>('DELETE', `/v2/pet/${id}`);
  }

  static getPetsByStatus(status: string) {
    return this.request<PetBody[]>('GET', `/v2/pet/findByStatus?status=${status}`);
  }
}
