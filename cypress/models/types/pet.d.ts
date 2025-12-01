declare namespace Cypress {
  interface Pet {
    id: number;
    name: string;
    photoUrls: string[];
    status: string;
  }

  type PetResponse = Cypress.Response<Pet>;
}