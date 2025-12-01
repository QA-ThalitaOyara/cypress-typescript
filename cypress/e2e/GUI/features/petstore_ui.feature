@ui
Feature: Petstore UI (Swagger) checks
  As a tester I want to validate basic elements of the Petstore Swagger UI
  To demonstrate a sample UI test

  Scenario: Open the Swagger UI and verify pet operations
    Given I open the Petstore Swagger UI
    Then I should see the section or reference to "pet"
    And I should see that the UI is loaded

  Scenario: Verify the "Try it out" control is available for operations
    Given I open the Petstore Swagger UI
    When click on the GET endpoint "/pet/findByStatus" section to expand it
    Then I should see the text Try it out

  Scenario: Verify the Swagger UI header is present
    Given I open the Petstore Swagger UI
    Then I should see the text "Swagger Petstore"

  Scenario: Verify the search input is present in the UI
    Given I open the Petstore Swagger UI
    When click on the GET endpoint "/pet/findByStatus" section to expand it
    And click on the Try it out button
    Then the status select should contain options "available,pending,sold"
