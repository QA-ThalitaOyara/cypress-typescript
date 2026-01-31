import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { User } from '../../../types/user';
import { UserBuilder } from '../builders/userBuilder';
import UserApi from '../pages/userApi.page';
import UserApiAssertions from '../assertions/userApi.assertions';

/**
 * Creates a new user payload with random data
 */
Given('I have a new user payload', () => {
  const user = new UserBuilder()
    .withRandomUsername()
    .withRandomFirstName()
    .withRandomLastName()
    .withRandomEmail()
    .withRandomPassword()
    .withRandomPhone()
    .build();
  cy.wrap(user).as('user');
  cy.wrap(user.username).as('username');
});

/**
 * Creates the user via API
 */
When('I create the user via API', () => {
  cy.get<User>('@user').then((user) => {
    UserApi.createUsersWithList([user]).as('lastResponse');
  });
});

/**
 * Validates the create user response
 */
Then('the create user response should contain the same username', () => {
  cy.get<Cypress.Response<User[]>>('@lastResponse').then((resp) => {
    cy.get<User>('@user').then((user) => {
      UserApiAssertions.validateCreateUsersResponse(resp, [user]);
      cy.wrap(user.id).as('userId');
    });
  });
});

/**
 * Retrieves the user by username via API
 */
When('I retrieve the user by username via API', () => {
  cy.get<string>('@username').then((username) => {
    UserApi.getUserByName(username).as('lastResponse');
  });
});

/**
 * Validates the retrieved user details
 */
Then('the returned user should have the same details', () => {
  cy.get<Cypress.Response<User>>('@lastResponse').then((resp) => {
    cy.get<User>('@user').then((user) => {
      UserApiAssertions.validateGetUserResponse(resp, user);
    });
  });
});

/**
 * Updates the user via API with new details
 */
When('I update the user via API with new details', () => {
  cy.get<string>('@username').then((username) => {
    cy.get<User>('@user').then((originalUser) => {
      const updatedUser = { ...originalUser, firstName: 'UpdatedFirst' };
      UserApi.updateUser(username, updatedUser).as('lastResponse');
      cy.wrap(updatedUser).as('updatedUser');
    });
  });
});

/**
 * Validates the update user response
 */
Then('the update user response should contain the new details', () => {
  cy.get<Cypress.Response<User>>('@lastResponse').then((resp) => {
    cy.get<User>('@updatedUser').then((updatedUser) => {
      UserApiAssertions.validateUpdateUserResponse(resp, updatedUser);
    });
  });
});

/**
 * Deletes the user via API
 */
When('I delete the user via API', () => {
  cy.get<string>('@username').then((username) => {
    UserApi.deleteUser(username).as('lastResponse');
  });
});

/**
 * Validates the delete user response
 */
Then('the delete user call should return success or not found', () => {
  cy.get<Cypress.Response<{}>>('@lastResponse').then((resp) => {
    UserApiAssertions.validateDeleteUserResponse(resp);
  });
});