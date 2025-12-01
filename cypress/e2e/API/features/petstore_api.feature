Feature: Petstore API CRUD
  As a tester I want to use the public Swagger Petstore API
  To demonstrate examples of creating, reading, updating and deleting a pet

  Scenario Outline: Create a pet via API - <name>
    Given I have a new pet payload with name "<name>" and status "<status>"
    When I create the pet via API
    Then the create response should contain the same name "<name>"
    
    Examples:
      | name   | status    |
      | fluffy | available |
      | sparky | pending   |
  
  Scenario Outline: Retrieve a pet via API - <name>
    Given I have a new pet payload with name "<name>" and status "<status>"
    When I create the pet via API
    And I retrieve the pet via API
    Then the returned pet should have the same name
    
    Examples:
      | name   | status    |
      | fluffy | available |
      | sparky | pending   |
  
  Scenario Outline: Update a pet via API - <name>
    Given I have a new pet payload with name "<name>" and status "<status>"
    When I create the pet via API
    And I update the pet via API with name "<updatedName>" and status "<updatedStatus>"
    Then the update response should contain the new name and status
    Examples:
      | name   | status    | updatedName | updatedStatus |
      | fluffy | available | fluffy-upd  | sold          |
      | sparky | pending   | sparky-upd  | available     |
      
  Scenario Outline: Delete a pet via API - <name>
    Given I have a new pet payload with name "<name>" and status "<status>"
    When I create the pet via API
    And I delete the pet via API
    Then the delete call should return success or not found

    Examples:
      | name   | status    |
      | fluffy | available |
      | sparky | pending   |
