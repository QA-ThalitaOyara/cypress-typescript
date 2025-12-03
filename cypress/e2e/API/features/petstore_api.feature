@api
Feature: Petstore API CRUD
  As a tester I want to use the public Swagger Petstore API
  To demonstrate examples of creating, reading, updating and deleting a pet

  Scenario: Create a pet via API
    Given I have a new pet payload
    When I create the pet via API
    Then the create response should contain the same name

  Scenario: Retrieve a pet via API
    Given I have a new pet payload
    When I create the pet via API
    And I retrieve the pet via API
    Then the returned pet should have the same name

  Scenario: Update a pet via API
    Given I have a new pet payload
    When I create the pet via API
    And I update the pet via API with name and status
    Then the update response should contain the new name and status

  Scenario: Delete a pet via API
    Given I have a new pet payload
    When I create the pet via API
    And I delete the pet via API
    Then the delete call should return success or not found
