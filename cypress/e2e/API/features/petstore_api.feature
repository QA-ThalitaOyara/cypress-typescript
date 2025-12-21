@api @domain-pet @POST-/pet @coverage-critical
Scenario: Create a pet via API
  Given I have a new pet payload
  When I create the pet via API
  Then the create response should contain the same name

@api @domain-pet @GET-/pet/{petId} @coverage-critical
Scenario: Retrieve a pet via API
  Given I have a new pet payload
  When I create the pet via API
  And I retrieve the pet via API
  Then the returned pet should have the same name

@api @domain-pet @PUT-/pet @coverage-critical
Scenario: Update a pet via API
  Given I have a new pet payload
  When I create the pet via API
  And I update the pet via API with name and status
  Then the update response should contain the new name and status

@api @domain-pet @DELETE-/pet/{petId} @coverage-critical
Scenario: Delete a pet via API
  Given I have a new pet payload
  When I create the pet via API
  And I delete the pet via API
  Then the delete call should return success or not found

@api @domain-pet @GET-/pet/findByStatus @coverage-additional
Scenario: Retrieve an existing pet from the list by ID
  When I fetch pets with status "available"
  Then I should get a list of pets
  And I store the first pet ID for later use
  When I retrieve the pet using the stored ID
  Then the retrieved pet should exist with valid data
