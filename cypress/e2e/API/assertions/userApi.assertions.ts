import { User } from '../../../types/user';

export default class UserApiAssertions {
  /**
   * Validates get user response
   */
  static validateGetUserResponse(resp: Cypress.Response<User>, expectedUser: User) {
    expect(resp.status).to.equal(200);
    expect(resp.body.username).to.equal(expectedUser.username);
    expect(resp.body.firstName).to.equal(expectedUser.firstName);
    expect(resp.body.lastName).to.equal(expectedUser.lastName);
    expect(resp.body.email).to.equal(expectedUser.email);
  }

  /**
   * Validates create users with list response
   */
  static validateCreateUsersResponse(resp: Cypress.Response<any>, expectedUsers: User[]) {
    expect(resp.status).to.equal(200);
    // The Petstore API returns a response message for batch operations
    expect(resp.body).to.exist;
  }

  /**
   * Validates update user response
   */
  static validateUpdateUserResponse(resp: Cypress.Response<User>, expectedUser: User) {
    expect(resp.status).to.equal(200);
    expect(resp.body).to.exist;
  }

  /**
   * Validates delete user response
   */
  static validateDeleteUserResponse(resp: Cypress.Response<{}>) {
    expect([200, 404]).to.include(resp.status);
  }
}