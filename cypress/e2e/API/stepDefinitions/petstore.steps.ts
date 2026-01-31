import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PetBody } from '../../../types/pet';
import { PetBuilder } from '../builders/petBuilder';
import PetApiAssertions from '../assertions/petApi.assertions';
import PetApi from '../pages/petApi.page';

/**
 * Creates a new pet payload with random data
 */
Given('I have a new pet payload', () => {
  const pet = new PetBuilder()
    .withRandomName()
    .withRandomStatus()
    .build();

  cy.wrap(pet).as('pet');
  cy.wrap(pet.id).as('petId');
});

/**
 * Creates the pet via API
 */
When('I create the pet via API', () => {
  cy.get<PetBody>('@pet').then((pet) => {
    PetApi.createPet(pet).as('createResp');
  });
});

/**
 * Validates the create pet response
 */
Then('the create response should contain the same name', () => {
  cy.get<Cypress.Response<PetBody>>('@createResp').then((resp) => {
    cy.get<PetBody>('@pet').then((pet) => {
      PetApiAssertions.validateCreateResponse(resp, pet);
    });
  });
});

/**
 * Retrieves the pet via API
 */
When('I retrieve the pet via API', () => {
  cy.get<number>('@petId').then((petId) => {
    PetApi.getPet(petId).as('getResp');
  });
});

/**
 * Validates the retrieved pet
 */
Then('the returned pet should have the same name', () => {
  cy.get<Cypress.Response<PetBody>>('@getResp').then((resp) => {
    cy.get<PetBody>('@pet').then((pet) => {
      PetApiAssertions.validateGetResponse(resp, pet);
    });
  });
});

/**
 * Updates the pet via API with new data
 */
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

/**
 * Validates the update pet response
 */
Then('the update response should contain the new name and status', () => {
  cy.get<Cypress.Response<PetBody>>('@updateResp').then((resp) => {
    cy.get<PetBody>('@updatedPet').then((updatedPet) => {
      PetApiAssertions.validateUpdateResponse(resp, updatedPet);
    });
  });
});

/**
 * Deletes the pet via API
 */
When('I delete the pet via API', () => {
  cy.get<number>('@petId').then((petId) => {
    PetApi.deletePet(petId).as('deleteResp');
  });
});

/**
 * Validates the delete pet response
 */
Then('the delete call should return success or not found', () => {
  cy.get<Cypress.Response<PetBody>>('@deleteResp').then((resp) => {
    PetApiAssertions.validateDeleteResponse(resp);
  });
});

/**
 * Fetches pets by status
 */
When('I fetch pets with status {string}', (status: string) => {
  PetApi.getPetsByStatus(status).as('petList');
});

/**
 * Validates that a list of pets is returned
 */
Then('I should get a list of pets', () => {
  cy.get<Cypress.Response<PetBody[]>>('@petList').then((resp) => {
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.be.greaterThan(0);
  });
});

/**
 * Stores the third pet ID for later use
 */
Then('I store the third pet ID for later use', () => {
  cy.get<Cypress.Response<PetBody[]>>('@petList').then((resp) => {
    const thirdPetId = resp.body[2].id;
    cy.wrap(thirdPetId).as('petId');
  });
});

/**
 * Retrieves the pet using the stored ID
 */
When('I retrieve the pet using the stored ID', () => {
  cy.get<number>('@petId').then((petId) => {
    PetApi.getPet(petId).as('retrievedPet');
  });
});

/**
 * Validates the retrieved pet has valid data
 */
Then('the retrieved pet should exist with valid data', () => {
  cy.get<Cypress.Response<PetBody>>('@retrievedPet').then((resp) => {
    expect(resp.status).to.equal(200);
    expect(resp.body).to.have.property('id');
    expect(resp.body).to.have.property('name');
    expect(resp.body).to.have.property('status');
  });
});
