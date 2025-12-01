import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PetApi from '../pages/petApi.page';

Given('que eu tenho um payload de pet novo com nome {string} e status {string}',  (name: string, status: string) => {
  const uniqueId = Date.now();
  const pet: Cypress.Pet = {
    id: uniqueId,
    name: `${name}${uniqueId}`,
    photoUrls: [],
    status,
  };
  cy.wrap<Cypress.Pet>(pet).as('pet');
});

When('eu criar o pet via API', () => {
  cy.get<Cypress.Pet>('@pet').then((pet) => {
    PetApi.createPet(pet).as('createResp');
  });
});

Then('a resposta da criação deve conter o mesmo nome {string}', (name:string) => {
  cy.get<Cypress.PetResponse>('@createResp').then((resp) => {
    expect(resp.status).to.be.oneOf([200, 201]);
    expect(resp.body).to.have.property('name');
    expect(resp.body.name).to.equal(name + resp.body.id);
  });
});

When('eu recuperar o pet pela API', () => {
  cy.get<Cypress.Pet>('@pet').then((pet) => {
    PetApi.getPet(pet.id).as('getResp');
  });
});

Then('o pet retornado deve ter o mesmo nome', () => {
  cy.get('@getResp').then((resp: any) => {
    expect(resp.status).to.equal(200);
    cy.get<Cypress.Pet>('@pet').then((pet) => {
      expect(resp.body).to.have.property('name', pet.name);
    });
  });
});

When('eu atualizar o pet via API com nome {string} e status {string}', (updatedName: string, updatedStatus: string) => {
  cy.get<Cypress.Pet>('@pet').then((pet) => {
    const updated: Cypress.Pet = Object.assign({}, pet, { name: updatedName, status: updatedStatus });
    PetApi.updatePet(updated).as('updateResp');
    cy.wrap<Cypress.Pet>(updated).as('updatedPet');
  });
});

Then('a resposta da atualização deve conter o novo nome e status', () => {
  cy.get('@updateResp').then((resp: any) => {
    expect(resp.status).to.be.oneOf([200, 201]);
    cy.get<Cypress.Pet>('@updatedPet').then((updatedPet) => {
      expect(resp.body).to.have.property('name', updatedPet.name);
      expect(resp.body).to.have.property('status', updatedPet.status);
    });
  });
});

When('eu remover o pet via API', () => {
  cy.get<Cypress.Pet>('@pet').then((pet) => {
    PetApi.deletePet(pet.id).as('deleteResp');
  });
});

Then('a chamada de remoção deve retornar sucesso ou não encontrado', () => {
  cy.get('@deleteResp').then((resp: any) => {
    expect(resp.status).to.be.oneOf([200, 404]);
  });
});
