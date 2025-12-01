Feature: Petstore UI (Swagger) checks
  Como testador quero validar elementos básicos da Swagger UI do Petstore
  Para demonstrar um exemplo de teste de interface

  Scenario: Abrir a Swagger UI e verificar operações de pet
    Given que eu abro a Swagger UI do Petstore
    Then eu devo ver a seção ou referência a "pet"
    And devo ver que a UI está carregada
