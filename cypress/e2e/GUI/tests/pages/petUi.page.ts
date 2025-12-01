export default class PetUi {

  static visit() {
    return cy.visit('');
  }

  static getMainContainer() {
    return cy.get('#swagger-ui');
  }

  static findText(text: string) {
    return cy.contains(text);
  }
}
