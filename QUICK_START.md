# Guia Rápido: Como Criar Testes com a Nova Arquitetura

## 🎯 Exemplo Prático: Testar Endpoint GET /user/{username}

### Passo 1: Tipo TypeScript (se não existir)
```typescript
// cypress/types/user.ts
export interface User {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userStatus?: number;
}
```

### Passo 2: Builder (se não existir)
```typescript
// cypress/e2e/api/builders/userBuilder.ts
export class UserBuilder {
  private user: User;

  constructor() {
    this.user = {
      id: Date.now(),
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      userStatus: 1
    };
  }

  withRandomUsername() {
    this.user.username = 'user_' + this.user.id;
    return this;
  }

  build() {
    return this.user;
  }
}
```

### Passo 3: Page Object (API endpoints)
```typescript
// cypress/e2e/api/pages/userApi.page.ts
import { User } from '../../../types/user';
import { ApiBase } from '../common/apiBase';
import { UrlBuilder } from '../common/urlBuilder';
import { HeaderFactory } from '../common/headerFactory';

export default class UserApi {
  private static urlBuilder = new UrlBuilder('/v2');

  static getUserByName(username: string) {
    const url = this.urlBuilder.build('/user/{username}', { username });
    return ApiBase.request<User>('GET', url, HeaderFactory.baseHeaders());
  }
}
```

### Passo 4: Assertions (validações)
```typescript
// cypress/e2e/api/pages/userApi.assertions.ts
import { User } from '../../../types/user';

export default class UserApiAssertions {
  static validateGetUserResponse(resp: Cypress.Response<User>, expectedUser: User) {
    expect(resp.status).to.equal(200);
    expect(resp.body.username).to.equal(expectedUser.username);
    expect(resp.body.firstName).to.equal(expectedUser.firstName);
  }
}
```

### Passo 5: Steps (cenários)
```typescript
// cypress/e2e/api/stepDefinitions/user.steps.ts
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { User } from '../../../types/user';
import { UserBuilder } from '../builders/userBuilder';
import UserApi from '../pages/userApi.page';
import UserApiAssertions from '../pages/userApi.assertions';

Given('I have a valid user', () => {
  const user = new UserBuilder()
    .withRandomUsername()
    .build();
  cy.wrap(user).as('user');
  cy.wrap(user.username).as('username');
});

When('I retrieve the user by username via API', () => {
  cy.get<string>('@username').then((username) => {
    UserApi.getUserByName(username).as('response');
  });
});

Then('the user should be retrieved successfully', () => {
  cy.get<Cypress.Response<User>>('@response').then((resp) => {
    cy.get<User>('@user').then((user) => {
      UserApiAssertions.validateGetUserResponse(resp, user);
    });
  });
});
```

### Passo 6: Feature File (cenários Gherkin)
```gherkin
# cypress/e2e/api/features/user_api.feature
@api @domain-user
Feature: User API tests
  
  @GET-/user/{username}
  Scenario: Retrieve user by username
    Given I have a valid user
    When I retrieve the user by username via API
    Then the user should be retrieved successfully
```

### Passo 7: Executar
```bash
npx cypress run --spec "cypress/e2e/api/features/user_api.feature"
```

---

## 📋 Checklist de Criação

- [ ] Tipo TypeScript criado (se novo)
- [ ] Builder criado com valores padrão válidos
- [ ] Page Object com todos os endpoints
- [ ] Assertions para cada tipo de resposta
- [ ] Steps legíveis e reutilizáveis
- [ ] Feature file com cenários claros
- [ ] Testes rodando e passando
- [ ] Sem alias para estado de negócio
- [ ] Sem duplicação de código
- [ ] Documentado em comentários

---

## 🔑 Padrões Importantes

### ✅ BOM - Steps Curtos e Legíveis
```typescript
Given('I have a valid user', () => {
  const user = new UserBuilder().withRandomUsername().build();
  cy.wrap(user).as('user');
});

When('I create the user via API', () => {
  cy.get<User>('@user').then((user) => {
    UserApi.createUsersWithList([user]).as('lastResponse');
  });
});

Then('user should be created', () => {
  cy.get<Cypress.Response<any>>('@lastResponse').then((resp) => {
    UserApiAssertions.validateCreateResponse(resp);
  });
});
```

### ❌ RUIM - Steps com Lógica Técnica
```typescript
// Não fazer isso!
Given('I create a user', () => {
  cy.request({
    method: 'POST',
    url: 'https://petstore.swagger.io/v2/user/createWithList',
    headers: { 'Content-Type': 'application/json' },
    body: [{
      id: 123,
      username: 'testuser',
      firstName: 'Test',
      // muitos detalhes técnicos...
    }]
  }).as('response');
});
```

### ✅ BOM - Builders com Valores Válidos
```typescript
const user = new UserBuilder()
  .withRandomUsername()
  .withRandomEmail()
  .withPassword('MyPassword123!')
  .build();
```

### ❌ RUIM - JSONs Inline
```typescript
// Não fazer isso!
cy.wrap({
  id: 123,
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
  password: 'pass123',
  phone: '1234567890'
}).as('user');
```

### ✅ BOM - Page Objects Reutilizáveis
```typescript
// Muda em um lugar, funciona em todos os testes
static getUserByName(username: string) {
  const url = this.urlBuilder.build('/user/{username}', { username });
  return ApiBase.request<User>('GET', url, HeaderFactory.baseHeaders());
}
```

### ❌ RUIM - Endpoints Acoplados aos Steps
```typescript
// Não fazer isso!
When('I get the user', () => {
  cy.api({
    method: 'GET',
    url: 'https://petstore.swagger.io/v2/user/testuser',
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### ✅ BOM - Assertions Reutilizáveis
```typescript
static validateGetUserResponse(resp: Cypress.Response<User>, expectedUser: User) {
  expect(resp.status).to.equal(200);
  expect(resp.body.username).to.equal(expectedUser.username);
}
```

### ❌ RUIM - Assertions Inline
```typescript
// Não fazer isso!
Then('the user should exist', () => {
  cy.get('@response').then((resp) => {
    expect(resp.status).to.equal(200);
    expect(resp.body.username).to.equal('testuser');
    expect(resp.body.firstName).to.exist;
    expect(resp.body.email).to.exist;
  });
});
```

---

## 🎲 Dados de Teste

### ✅ BOM - Massa em Fixtures
```json
{
  "validUser": {
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
}
```

```typescript
Given('I have a valid user from fixtures', () => {
  cy.fixture('testData/user.json').then((users) => {
    cy.wrap(users.validUser).as('user');
    cy.wrap(users.validUser.username).as('username');
  });
});
```

### ❌ RUIM - Hardcode em Steps
```typescript
// Não fazer isso!
Given('I have a user', () => {
  const user = {
    username: 'testuser123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'MyPass123!',
    phone: '555-1234'
  };
  cy.wrap(user).as('user');
});
```

---

## 🔄 Fluxo de Um Teste Completo

```
Feature File (.feature)
    ↓
Gherkin Scenario
    ↓
Given (Arrange)
    ├─ Create data via Builder
    ├─ Store in cy.wrap() aliases
    └─ Ready for test

When (Act)
    ├─ Call API via Page Object
    ├─ Page Object uses ApiBase
    ├─ ApiBase calls cy.api()
    └─ Response stored in alias

Then (Assert)
    ├─ Retrieve response from alias
    ├─ Use specialized Assertions
    └─ Test passes ✅

Clean Up (automatic)
    └─ Context reset for next scenario
```

---

## 📊 Exemplo Real: Criar → Atualizar → Deletar

```gherkin
@api @domain-user @smoke
Scenario: Complete user lifecycle
  Given I have a new user payload
  When I create the user via API
  Then the create user response should contain the same username
  When I update the user via API with new details
  Then the update user response should contain the new details
  When I delete the user via API
  Then the delete user call should return success or not found
```

### Fluxo de Dados
```
1. Given
   user = UserBuilder().withRandomUsername().build()
   store: user, username

2. When (Create)
   UserApi.createUsersWithList([user])
   store: lastResponse

3. Then (Validate Create)
   Get lastResponse
   Get user
   Compare

4. When (Update)
   Get username
   Get user
   UserApi.updateUser(username, updatedUser)
   store: lastResponse

5. Then (Validate Update)
   Get lastResponse
   Get updatedUser
   Compare

6. When (Delete)
   Get username
   UserApi.deleteUser(username)
   store: lastResponse

7. Then (Validate Delete)
   Get lastResponse
   Check status [200, 404]
```

---

## 🐛 Debugging

### Ver o que está no contexto
```typescript
When('I debug the context', () => {
  cy.get('@user').then((user) => {
    console.log('User:', user);
  });
  
  cy.get('@username').then((username) => {
    console.log('Username:', username);
  });
  
  cy.get('@lastResponse').then((resp) => {
    console.log('Response:', resp);
  });
});
```

### Pausar o teste
```typescript
When('I create the user and pause', () => {
  cy.get<User>('@user').then((user) => {
    UserApi.createUsersWithList([user]).as('lastResponse');
  });
  cy.pause(); // Cypress Debug
});
```

### Log detalhado
```typescript
Then('the response is valid', () => {
  cy.get('@lastResponse').then((resp) => {
    cy.log(`Status: ${resp.status}`);
    cy.log(`Body: ${JSON.stringify(resp.body, null, 2)}`);
    expect(resp.status).to.equal(200);
  });
});
```

---

## 🚀 Tips & Tricks

### Reutilizar Steps
```typescript
// Em user_api.feature
Given('I have a valid user from fixtures')
When('I retrieve the user by username via API')
Then('the returned user should have the same details')

// Mesmos steps funcionam em outros contextos!
```

### Múltiplos Usuários
```typescript
Given('I have two valid users', () => {
  const user1 = new UserBuilder().withRandomUsername().build();
  const user2 = new UserBuilder().withRandomUsername().build();
  cy.wrap(user1).as('user1');
  cy.wrap(user2).as('user2');
});

When('I create both users', () => {
  cy.get<User>('@user1').then((user1) => {
    UserApi.createUsersWithList([user1]).as('response1');
  });
  cy.get<User>('@user2').then((user2) => {
    UserApi.createUsersWithList([user2]).as('response2');
  });
});
```

### Variações de Dados
```typescript
Given('I have a user with invalid email', () => {
  const user = new UserBuilder()
    .withRandomUsername()
    .withEmail('invalid-email') // Propositalmente inválido
    .build();
  cy.wrap(user).as('invalidUser');
});

When('I create the invalid user', () => {
  cy.get<User>('@invalidUser').then((user) => {
    UserApi.createUsersWithList([user]).as('response');
  });
});

Then('the response should indicate invalid email', () => {
  cy.get('@response').then((resp) => {
    expect(resp.status).to.be.oneOf([400, 422]);
  });
});
```

---

## 📞 Suporte e Troubleshooting

### Erro: "Type annotations should include catch clause parameter types"
**Solução**: Adicione tipo explícito ao Then
```typescript
// ❌ Errado
Then('I should get a response', () => {
  cy.get('@response').then((resp) => { // Type any!
    expect(resp.status).to.equal(200);
  });
});

// ✅ Correto
Then('I should get a response', () => {
  cy.get<Cypress.Response<User>>('@response').then((resp) => {
    expect(resp.status).to.equal(200);
  });
});
```

### Erro: "Cannot read property of undefined"
**Causa**: Alias não foi criado em step anterior
**Solução**: Verficar que todos os Given e When estão rodando

```typescript
// Verificar isso em cada Then
cy.get('@alias').then((value) => {
  console.log('Value exists:', value);
});
```

### Testes Falhando Aleatoriamente
**Causa**: Dependência de estado global ou timing
**Solução**: 
- Cada teste deve ser independente
- Não reutilizar dados de testes anteriores
- Usar wait explícito se necessário

```typescript
When('I wait for response', () => {
  cy.get('@response').should('exist'); // Wait for it
});
```

