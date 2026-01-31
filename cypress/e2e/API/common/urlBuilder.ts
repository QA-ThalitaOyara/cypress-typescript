export class UrlBuilder {
  private baseUrl: string;

  /**
   * Creates a URL builder instance
   */
  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Builds URL with path and parameter substitution
   */
  build(path: string, params?: Record<string, string | number>): string {
    let url = this.baseUrl + path;
    if (params) {
      Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key].toString());
      });
    }
    return url;
  }
}