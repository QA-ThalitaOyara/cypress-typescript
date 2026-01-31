import { Order } from '../../../types/store';

export class OrderBuilder {
  private order: Order;

  /**
   * Initializes a new Order with default values
   */
  constructor() {
    this.order = {
      id: Date.now(),
      petId: 1,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false
    };
  }

  /**
   * Sets the pet ID for the order
   */
  withPetId(petId: number) {
    this.order.petId = petId;
    return this;
  }

  /**
   * Sets the quantity for the order
   */
  withQuantity(quantity: number) {
    this.order.quantity = quantity;
    return this;
  }

  /**
   * Sets the status for the order
   */
  withStatus(status: Order['status']) {
    this.order.status = status;
    return this;
  }

  /**
   * Sets the ship date for the order
   */
  withShipDate(shipDate: string) {
    this.order.shipDate = shipDate;
    return this;
  }

  /**
   * Sets the complete flag for the order
   */
  withComplete(complete: boolean) {
    this.order.complete = complete;
    return this;
  }

  /**
   * Returns the constructed order object
   */
  build() {
    return this.order;
  }
}