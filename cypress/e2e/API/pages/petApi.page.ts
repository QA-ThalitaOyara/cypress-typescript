import { PetBody } from '../../../types/pet';
import { ApiBase } from '../common/apiBase';
import { UrlBuilder } from '../common/urlBuilder';
import { HeaderFactory } from '../common/headerFactory';

export default class PetApi {
  private static urlBuilder = new UrlBuilder('/v2');

  /**
   * Creates a new pet
   */
  static createPet(pet: PetBody) {
    const url = this.urlBuilder.build('/pet');
    return ApiBase.request<PetBody>('POST', url, HeaderFactory.baseHeaders(), pet);
  }

  /**
   * Gets a pet by ID
   */
  static getPet(id: number) {
    const url = this.urlBuilder.build('/pet/{id}', { id });
    return ApiBase.request<PetBody>('GET', url, HeaderFactory.baseHeaders());
  }

  /**
   * Updates an existing pet
   */
  static updatePet(pet: PetBody) {
    const url = this.urlBuilder.build('/pet');
    return ApiBase.request<PetBody>('PUT', url, HeaderFactory.baseHeaders(), pet);
  }

  /**
   * Deletes a pet by ID
   */
  static deletePet(id: number) {
    const url = this.urlBuilder.build('/pet/{id}', { id });
    return ApiBase.request<{}>('DELETE', url, HeaderFactory.baseHeaders());
  }

  /**
   * Gets pets by status
   */
  static getPetsByStatus(status: string) {
    const url = this.urlBuilder.build('/pet/findByStatus?status={status}', { status });
    return ApiBase.request<PetBody[]>('GET', url, HeaderFactory.baseHeaders());
  }
}
