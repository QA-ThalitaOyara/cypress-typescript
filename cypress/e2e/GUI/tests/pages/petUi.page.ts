export default class PetUi {
  // Centralized selectors for easier maintenance
  static selectors = {
    main: '#swagger-ui',
    tryItOutText: 'Try it out',
    allowAllCookiesButton: '.ch2-allow-all-btn',
    selectStatus: '.parameters-col_description > select',
  } as const;

  static allowAllCookies(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.allowAllCookiesButton).click();
  }

  static visit(): Cypress.Chainable<Window> {
    return cy.visit('');
  }

  static getMainContainer(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.main);
  }

  static findText(text: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(text);
  }

  static getTryItOut(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(this.selectors.tryItOutText);
  }

static getStatusSelect(): Cypress.Chainable<JQuery<HTMLSelectElement>> {
  return cy.get(this.selectors.selectStatus);
}

  static getStatusOptions(): Cypress.Chainable<string[]> {
    return this.getStatusSelect().then(($select) => {
      const options = $select.find('option')
        .toArray()
        .map((el) => el.value || el.value.trim());
      return cy.wrap(options);
    });
  }
}
