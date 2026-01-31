import { User } from '../../../types/user';
import { ApiBase } from '../common/apiBase';
import { UrlBuilder } from '../common/urlBuilder';
import { HeaderFactory } from '../common/headerFactory';

export default class UserApi {
  private static urlBuilder = new UrlBuilder('/v2');

  /**
   * Gets a user by username
   */
  static getUserByName(username: string) {
    const url = this.urlBuilder.build('/user/{username}', { username });
    return ApiBase.request<User>('GET', url, HeaderFactory.baseHeaders());
  }

  /**
   * Creates users with a list
   */
  static createUsersWithList(users: User[]) {
    const url = this.urlBuilder.build('/user/createWithList');
    return ApiBase.request<User[]>('POST', url, HeaderFactory.baseHeaders(), users);
  }

  /**
   * Updates a user by username
   */
  static updateUser(username: string, user: User) {
    const url = this.urlBuilder.build('/user/{username}', { username });
    return ApiBase.request<User>('PUT', url, HeaderFactory.baseHeaders(), user);
  }

  /**
   * Deletes a user by username
   */
  static deleteUser(username: string) {
    const url = this.urlBuilder.build('/user/{username}', { username });
    return ApiBase.request<{}>('DELETE', url, HeaderFactory.baseHeaders());
  }
}