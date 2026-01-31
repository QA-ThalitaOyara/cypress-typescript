@api
Feature: Store API (Swagger) checks
  As a tester I want to validate the API of the Store endpoints
  To demonstrate a sample API test

@domain-store @GET-/store/inventory @coverage-critical
Scenario: Get store inventory via API
  When I get the store inventory via API
  Then the inventory response should contain status counts

@domain-store @POST-/store/order @coverage-critical
Scenario: Place an order via API
  Given I have a new order payload
  When I place the order via API
  And I store the response order ID in context
  Then the place order response should contain the order details

@domain-store @GET-/store/order/{orderId} @coverage-critical
Scenario: Get order by ID via API
  Given I have a new order payload
  When I place the order via API
  And I store the response order ID in context
  And I retrieve the order by ID via API
  Then the returned order should have the same details

@domain-store @DELETE-/store/order/{orderId} @coverage-critical
Scenario: Delete order via API
  Given I have a new order payload
  When I place the order via API
  And I store the response order ID in context
  And I delete the order via API
  Then the delete order call should return success or not found