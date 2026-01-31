@api
Feature: User API (Swagger) checks
  As a tester I want to validate the API of the User endpoints
  To demonstrate a sample API test

@domain-user @GET-/user/{username} @coverage-critical
Scenario: Get user by username via API
  Given I have a new user payload
  When I create the user via API
  And I store the response user ID in context
  And I retrieve the user by username via API
  Then the returned user should have the same details

@domain-user @POST-/user/createWithList @coverage-critical
Scenario: Create users with list input via API
  Given I have a new user payload
  When I create the user via API
  Then the create user response should contain the same username

@domain-user @PUT-/user/{username} @coverage-critical
Scenario: Update user via API
  Given I have a new user payload
  When I create the user via API
  And I update the user via API with new details
  Then the update user response should contain the new details

@domain-user @DELETE-/user/{username} @coverage-critical
Scenario: Delete user via API
  Given I have a new user payload
  When I create the user via API
  And I delete the user via API
  Then the delete user call should return success or not found