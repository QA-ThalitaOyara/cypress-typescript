export class ApiBase {
  /**
   * Makes an HTTP request using Cypress API
   */
  static request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    headers?: Record<string, string>,
    body?: any
  ): Cypress.Chainable<Cypress.Response<T>> {
    return cy.api({
      method,
      url,
      headers,
      body,
      failOnStatusCode: false
    }) as Cypress.Chainable<Cypress.Response<T>>;
  }
}