export class HeaderFactory {
  /**
   * Returns base headers for API requests
   */
  static baseHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Returns headers with authentication token
   */
  static withAuth(token: string): Record<string, string> {
    return {
      ...this.baseHeaders(),
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Returns headers with custom overrides
   */
  static override(headers: Record<string, string>): Record<string, string> {
    return {
      ...this.baseHeaders(),
      ...headers
    };
  }
}