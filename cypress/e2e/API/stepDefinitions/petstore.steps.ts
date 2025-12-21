import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PetBody } from '../../../types/pet';
import { PetBuilder } from 'cypress/e2e/api/builders/petBuilder';
import PetApiAssertions from 'cypress/e2e/api/pages/petApi.assertions';
import PetApi from 'cypress/e2e/api/pages/petApi.page';


Given('I have a new pet payload', () => {
  const pet = new PetBuilder()
    .withRandomName()
    .withRandomStatus()
    .build();

  cy.wrap(pet).as('pet');
});

When('I create the pet via API', () => {
  cy.get<PetBody>('@pet').then((pet) => {
    PetApi.createPet(pet).as('createResp');
  });
});

Then('the create response should contain the same name', () => {
  cy.get<Cypress.Response<PetBody>>('@createResp').then((resp) => {
    console.log('RESP:', resp);
    cy.get<PetBody>('@pet').then((pet) => {
      PetApiAssertions.validateCreateResponse(resp, pet);
    });
  });
});

When('I retrieve the pet via API', () => {
  cy.get<PetBody>('@pet').then((pet) => {
    PetApi.getPet(pet.id).as('getResp');
  });
});

Then('the returned pet should have the same name', () => {
  cy.get<Cypress.Response<PetBody>>('@getResp').then((resp) => {
    cy.get<PetBody>('@pet').then((pet) => {
      PetApiAssertions.validateGetResponse(resp, pet);
    });
  });
});

When('I update the pet via API with name and status', () => {
  cy.get<PetBody>('@pet').then((originalPet) => {
    const updatedPet = new PetBuilder()
      .withRandomName()
      .withRandomStatus()
      .build();
    updatedPet.id = originalPet.id;

    PetApi.updatePet(updatedPet).as('updateResp');
    cy.wrap(updatedPet).as('updatedPet');
  });
});

Then('the update response should contain the new name and status', () => {
  cy.get<Cypress.Response<PetBody>>('@updateResp').then((resp) => {
    cy.get<PetBody>('@updatedPet').then((updatedPet) => {
      PetApiAssertions.validateUpdateResponse(resp, updatedPet);
    });
  });
});

When('I delete the pet via API', () => {
  cy.get<PetBody>('@pet').then((pet) => {
    PetApi.deletePet(pet.id).as('deleteResp');
  });
});

Then('the delete call should return success or not found', () => {
  cy.get<Cypress.Response<PetBody>>('@deleteResp').then((resp) => {
    PetApiAssertions.validateDeleteResponse(resp);
  });
});

When('I fetch pets with status {string}', (status: string) => {
  PetApi.getPetsByStatus(status).as('petList');
});

Then('I should get a list of pets', () => {
  cy.get<Cypress.Response<PetBody[]>>('@petList').then((resp) => {
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.be.greaterThan(0);
  });
});

Then('I store the third pet ID for later use', () => {
  cy.get<Cypress.Response<PetBody[]>>('@petList').then((resp) => {
    const firstPetId = resp.body[3].id;
    cy.wrap(firstPetId).as('petIdFromList');
  });
});

When('I retrieve the pet using the stored ID', () => {
  cy.get<number>('@petIdFromList').then((petId) => {
    PetApi.getPet(petId).as('retrievedPet');
  });
});

Then('the retrieved pet should exist with valid data', () => {
  cy.get<Cypress.Response<PetBody>>('@retrievedPet').then((resp) => {
    expect(resp.status).to.equal(200);
    expect(resp.body).to.have.property('id');
    expect(resp.body).to.have.property('name');
    expect(resp.body).to.have.property('status');
  });
});
