/**
 * Builder for creating Cypress.Pet objects
 */
export class PetBuilder {
  private pet: Cypress.Pet;

  /** Initializes a new Pet with default values */
  constructor() {
    this.pet = {
      id: Date.now(),
      name: '',
      status: 'available',
      photoUrls: []
    };
  }

  /** Sets a custom name */
  withName(name: string) {
    this.pet.name = name;
    return this;
  }

  /** Generates a default name based on id */
  withRandomName() {
    this.pet.name = 'Pet_' + this.pet.id;
    return this;
  }

  /** Sets a custom status */
  withStatus(status: string) {
    this.pet.status = status;
    return this;
  }

  /** Assigns a random status: 'available', 'pending', or 'sold' */
  withRandomStatus() {
    const statuses: Cypress.Pet['status'][] = ['available', 'pending', 'sold'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    this.pet.status = statuses[randomIndex];
    return this;
  }

  /** Sets photo URLs */
  withPhotoUrls(urls: string[]) {
    this.pet.photoUrls = urls;
    return this;
  }

  /** Returns the constructed pet object */
  build() {
    return this.pet;
  }
}