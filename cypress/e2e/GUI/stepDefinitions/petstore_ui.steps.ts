import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

import PetUi from '@gui/petUi.page';

Given('I open the Petstore Swagger UI', () => {
  PetUi.visit();
  PetUi.allowAllCookies().click();
});

When('click on the GET endpoint {string} section to expand it', (endpoint:string) => {
  PetUi.findText(endpoint).click();
});

When('click on the Try it out button', () => {
  PetUi.getTryItOut().click();
});

Then('I should see the section or reference to "pet"', () => {
  PetUi.findText('pet').should('exist');
});

Then('I should see that the UI is loaded', () => {
  PetUi.getMainContainer().should('exist');
});

Then('I should see the text Try it out', () => {
  PetUi.getTryItOut().should('exist');
});

Then('I should see the text {string}', (uiText: string) => {
  PetUi.findText(uiText).should('exist');
});

Then('I should see the search input', () => {
  PetUi.getStatusSelect().should('exist');
});

Then('the status select should contain options {string}', (expectedStatus: string) => {
  const expected = expectedStatus.split(',').map((s) => s.trim());
  PetUi.getStatusOptions().then((options) => {
    expect(options).to.have.members(expected);
  });
});
