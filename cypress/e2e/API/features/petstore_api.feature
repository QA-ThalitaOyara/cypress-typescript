Feature: Petstore API CRUD
  Como testador quero usar a API pública do Swagger Petstore
  Para demonstrar exemplos de criação, leitura, atualização e remoção de um pet

  Scenario Outline: Criar, recuperar, atualizar e remover um pet via API - <name>
    Given que eu tenho um payload de pet novo com nome "<name>" e status "<status>"
    When eu criar o pet via API
    Then a resposta da criação deve conter o mesmo nome "<name>"

    When eu recuperar o pet pela API
    Then o pet retornado deve ter o mesmo nome

    When eu atualizar o pet via API com nome "<updatedName>" e status "<updatedStatus>"
    Then a resposta da atualização deve conter o novo nome e status

    When eu remover o pet via API
    Then a chamada de remoção deve retornar sucesso ou não encontrado

    Examples:
      | name    | status    | updatedName   | updatedStatus |
      | fluffy  | available | fluffy-upd    | sold          |
      | sparky  | pending   | sparky-upd    | available     |
