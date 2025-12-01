import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

import PetApi from '@api/petApi.page';


Given('I have a new pet payload with name {string} and status {string}',  (name: string, status: string) => {
  const uniqueId = Date.now();
  const pet: Cypress.Pet = {
    id: uniqueId,
    name: `${name}${uniqueId}`,
    photoUrls: [],
    status,
  };
  cy.wrap<Cypress.Pet>(pet).as('pet');
});

When('I create the pet via API', () => {
  cy.get<Cypress.Pet>('@pet').then((pet) => {
    PetApi.createPet(pet).as('createResp');
  });
});

Then('the create response should contain the same name {string}', (name:string) => {
  cy.get<Cypress.PetResponse>('@createResp').then((resp) => {
    expect(resp.status).to.be.oneOf([200, 201]);
    expect(resp.body).to.have.property('name');
    expect(resp.body.name).to.equal(name + resp.body.id);
  });
});

When('I retrieve the pet via API', () => {
  cy.get<Cypress.Pet>('@pet').then((pet) => {
    PetApi.getPet(pet.id).as('getResp');
  });
});

Then('the returned pet should have the same name', () => {
  cy.get<Cypress.PetResponse>('@getResp').then((resp) => {
    expect(resp.status).to.equal(200);
    cy.get<Cypress.Pet>('@pet').then((pet) => {
      expect(resp.body).to.have.property('name', pet.name);
    });
  });
});

When('I update the pet via API with name {string} and status {string}', (updatedName: string, updatedStatus: string) => {
  cy.get<Cypress.Pet>('@pet').then((pet) => {
    const updated: Cypress.Pet = Object.assign({}, pet, { name: updatedName, status: updatedStatus });
    PetApi.updatePet(updated).as('updateResp');
    cy.wrap<Cypress.Pet>(updated).as('updatedPet');
  });
});

Then('the update response should contain the new name and status', () => {
  cy.get<Cypress.PetResponse>('@updateResp').then((resp) => {
    expect(resp.status).to.be.oneOf([200, 201]);
    cy.get<Cypress.Pet>('@updatedPet').then((updatedPet) => {
      expect(resp.body).to.have.property('name', updatedPet.name);
      expect(resp.body).to.have.property('status', updatedPet.status);
    });
  });
});

When('I delete the pet via API', () => {
  cy.get<Cypress.Pet>('@pet').then((pet) => {
    PetApi.deletePet(pet.id).as('deleteResp');
  });
});

Then('the delete call should return success or not found', () => {
  cy.get<Cypress.PetResponse>('@deleteResp').then((resp) => {
    expect(resp.status).to.be.oneOf([200, 404]);
  });
});
