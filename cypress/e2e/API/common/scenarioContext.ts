export interface ScenarioContext {
  petId?: number;
  userId?: number;
  username?: string;
  orderId?: number;
}

export class CustomWorld {
  context: ScenarioContext = {};

  /**
   * Sets the pet ID in context
   */
  setPetId(id: number) {
    this.context.petId = id;
  }

  /**
   * Gets the pet ID from context
   */
  getPetId(): number | undefined {
    return this.context.petId;
  }

  /**
   * Sets the user ID in context
   */
  setUserId(id: number) {
    this.context.userId = id;
  }

  /**
   * Gets the user ID from context
   */
  getUserId(): number | undefined {
    return this.context.userId;
  }

  /**
   * Sets the username in context
   */
  setUsername(username: string) {
    this.context.username = username;
  }

  /**
   * Gets the username from context
   */
  getUsername(): string | undefined {
    return this.context.username;
  }

  /**
   * Sets the order ID in context
   */
  setOrderId(id: number) {
    this.context.orderId = id;
  }

  /**
   * Gets the order ID from context
   */
  getOrderId(): number | undefined {
    return this.context.orderId;
  }
}