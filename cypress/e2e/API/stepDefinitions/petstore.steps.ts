import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PetApi from '@api/petApi.page';
import PetApiAssertions from '@api/petApi.assertions';
import { PetBuilder } from '@support/builders/petBuilder';
import { Pet } from '../../../models/types/pet';

Given('I have a new pet payload', () => {
  const pet = new PetBuilder()
    .withRandomName()
    .withRandomStatus()
    .build();

  cy.wrap(pet).as('pet');
});

When('I create the pet via API', () => {
  cy.get<Pet>('@pet').then((pet) => {
    PetApi.createPet(pet).as('createResp');
  });
});

Then('the create response should contain the same name', () => {
 cy.get<Pet>('@createResp').then((resp) => {
    cy.get<Pet>('@pet').then((pet) => {
    PetApiAssertions.validateCreateResponse(resp, pet);
    });
  });
});

When('I retrieve the pet via API', () => {
  cy.get<Pet>('@pet').then((pet) => {
    PetApi.getPet(pet.id).as('getResp');
  });
});

Then('the returned pet should have the same name', () => {
  cy.get<Pet>('@getResp').then((resp) => {
    cy.get<Pet>('@pet').then((pet) => {
      PetApiAssertions.validateGetResponse(resp, pet);
    });
  });
});

When('I update the pet via API with name and status', () => {
  cy.get<Pet>('@pet').then((originalPet) => {
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
  cy.get<Pet>('@updateResp').then((resp) => {
    cy.get<Pet>('@updatedPet').then((updatedPet) => {
      PetApiAssertions.validateUpdateResponse(resp, updatedPet);
    });
  });
});

When('I delete the pet via API', () => {
  cy.get<Pet>('@pet').then((pet) => {
    PetApi.deletePet(pet.id).as('deleteResp');
  });
});

Then('the delete call should return success or not found', () => {
  cy.get<Pet>('@deleteResp').then((resp) => {
    PetApiAssertions.validateDeleteResponse(resp);
  });
});
