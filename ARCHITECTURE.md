# Arquitetura Avançada de Testes API - Documentação

## 📋 Visão Geral

Este projeto implementa uma arquitetura escalável e reutilizável para testes de APIs baseada em princípios de design como **BDD (Behavior-Driven Development)**, **princípios SOLID** e **design patterns**. 

### Princípios Arquiteturais Implementados

1. **Testes Determinísticos**: Sem dependência de estado global, cada cenário é independente
2. **Expressão de Intenção**: Código que expressa **o quê** testar, não **como** fazer
3. **Abstrações Inteligentes**: Reduzem complexidade sem esconder detalhes
4. **Separação de Responsabilidades**: Infraestrutura não depende diretamente de Cypress
5. **Reutilização Real**: Steps comuns, builders, factories compartilhados entre domínios

---

## 🏗️ Estrutura do Projeto

```
cypress/e2e/api/
├── common/                          # Camada transversal e reutilizável
│   ├── apiBase.ts                   # Classe base para todas as requisições
│   ├── urlBuilder.ts                # Construtor de URLs com placeholders
│   ├── headerFactory.ts             # Factory para headers modulares
│   └── scenarioContext.ts           # Context tipado para armazenar estado do cenário
│
├── builders/                        # Data factories (padrão Builder)
│   ├── petBuilder.ts                # Construtor de pets
│   ├── userBuilder.ts               # Construtor de usuários
│   └── orderBuilder.ts              # Construtor de pedidos
│
├── pages/                           # Camada de API (Page Objects)
│   ├── petApi.page.ts               # Endpoints de pet
│   ├── petApi.assertions.ts         # Validações de pet
│   ├── userApi.page.ts              # Endpoints de usuário
│   ├── userApi.assertions.ts        # Validações de usuário
│   ├── storeApi.page.ts             # Endpoints de loja
│   └── storeApi.assertions.ts       # Validações de loja
│
├── stepDefinitions/                 # Steps do Cucumber
│   ├── worldSetup.ts                # Configuração do Cucumber World
│   ├── common.steps.ts              # Steps comuns entre domínios
│   ├── petstore.steps.ts            # Steps de pet
│   ├── user.steps.ts                # Steps de usuário
│   └── store.steps.ts               # Steps de loja
│
├── features/                        # Cenários em Gherkin
│   ├── petstore_api.feature         # Testes de pet
│   ├── user_api.feature             # Testes de usuário
│   └── store_api.feature            # Testes de loja
│
├── fixtures/
│   └── testData/                    # Massa de testes
│       ├── user.json
│       ├── order.json
│       └── pet.json
│
└── types/                           # Tipos TypeScript
    ├── pet.ts
    ├── user.ts
    └── store.ts
```

---

## 🔧 Camadas Arquiteturais

### 1. **Camada Base (ApiBase)**
Responsável por **todas** as requisições HTTP:

```typescript
export class ApiBase {
  static request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    headers?: Record<string, string>,
    body?: any
  ): Cypress.Chainable<Cypress.Response<T>> {
    return cy.api({
      method,
      url,
      headers,
      body,
      failOnStatusCode: false
    }) as Cypress.Chainable<Cypress.Response<T>>;
  }
}
```

**Benefícios:**
- ✅ Ponto único de mudança para comportamento HTTP
- ✅ Facilita logging, retry logic e tratamento de erros
- ✅ Sem acoplamento com Cypress (pode ser testada isoladamente)

---

### 2. **URL Builder**
Constrói URLs dinamicamente com suporte a placeholders:

```typescript
export class UrlBuilder {
  build(path: string, params?: Record<string, string | number>): string {
    let url = this.baseUrl + path;
    if (params) {
      Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key].toString());
      });
    }
    return url;
  }
}

// Uso:
const url = new UrlBuilder('/v2').build('/user/{username}', { username: 'john' });
// Resultado: /v2/user/john
```

**Benefícios:**
- ✅ URLs dinâmicas sem concatenação de strings
- ✅ Reutilizável para qualquer API
- ✅ Type-safe com TypeScript

---

### 3. **Header Factory**
Gerencia headers de forma modular:

```typescript
export class HeaderFactory {
  static baseHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  static withAuth(token: string): Record<string, string> {
    return {
      ...this.baseHeaders(),
      'Authorization': `Bearer ${token}`
    };
  }

  static override(headers: Record<string, string>): Record<string, string> {
    return {
      ...this.baseHeaders(),
      ...headers
    };
  }
}
```

**Benefícios:**
- ✅ Composição de headers
- ✅ Fácil adicionar autenticação
- ✅ Override granular quando necessário

---

### 4. **Builders (Data Factories)**
Padrão Builder para criação de dados válidos:

```typescript
export class UserBuilder {
  private user: User;

  constructor() {
    this.user = {
      id: Date.now(),
      username: '',
      firstName: '',
      // ... outros campos
    };
  }

  withUsername(username: string) {
    this.user.username = username;
    return this;
  }

  withRandomUsername() {
    this.user.username = 'user_' + this.user.id;
    return this;
  }

  build() {
    return this.user;
  }
}

// Uso:
const user = new UserBuilder()
  .withRandomUsername()
  .withRandomEmail()
  .build();
```

**Benefícios:**
- ✅ Dados válidos por padrão
- ✅ Override fácil de qualquer campo
- ✅ Reutilizável em múltiplos cenários
- ✅ Sem JSONs inline

---

### 5. **Page Objects (API Layer)**
Encapsulam endpoints e validações:

```typescript
export default class UserApi {
  private static urlBuilder = new UrlBuilder('/v2');

  static getUserByName(username: string) {
    const url = this.urlBuilder.build('/user/{username}', { username });
    return ApiBase.request<User>('GET', url, HeaderFactory.baseHeaders());
  }

  static updateUser(username: string, user: User) {
    const url = this.urlBuilder.build('/user/{username}', { username });
    return ApiBase.request<User>('PUT', url, HeaderFactory.baseHeaders(), user);
  }
}
```

**Benefícios:**
- ✅ Endpoints organizados por domínio
- ✅ Fácil refatoração (mudar URL em um lugar)
- ✅ Tipagem forte com TypeScript

---

### 6. **Assertions (Validações)**
Separadas por responsabilidade:

```typescript
export default class UserApiAssertions {
  static validateGetUserResponse(resp: Cypress.Response<User>, expectedUser: User) {
    expect(resp.status).to.equal(200);
    expect(resp.body.username).to.equal(expectedUser.username);
    expect(resp.body.firstName).to.equal(expectedUser.firstName);
  }

  static validateCreateUsersResponse(resp: Cypress.Response<any>, expectedUsers: User[]) {
    expect(resp.status).to.equal(200);
    expect(resp.body).to.exist;
  }
}
```

**Benefícios:**
- ✅ Validações reutilizáveis
- ✅ Separadas da lógica de teste
- ✅ Fáceis de manter

---

### 7. **Steps BDD**
Curtos, legíveis e sem lógica técnica pesada:

```typescript
Given('I have a new user payload', () => {
  const user = new UserBuilder()
    .withRandomUsername()
    .withRandomEmail()
    .build();
  cy.wrap(user).as('user');
  cy.wrap(user.username).as('username');
});

When('I create the user via API', () => {
  cy.get<User>('@user').then((user) => {
    UserApi.createUsersWithList([user]).as('lastResponse');
  });
});

Then('the create user response should contain the same username', () => {
  cy.get<Cypress.Response<User[]>>('@lastResponse').then((resp) => {
    cy.get<User>('@user').then((user) => {
      UserApiAssertions.validateCreateUsersResponse(resp, [user]);
      cy.wrap(user.id).as('userId');
    });
  });
});
```

**Benefícios:**
- ✅ Fáceis de ler (expressam intenção)
- ✅ Reutilizáveis entre cenários
- ✅ Sem estado oculto

---

## 📝 Exemplo Completo: Criar e Atualizar Usuário

### Feature File
```gherkin
@api @domain-user
Scenario: Create and update user
  Given I have a new user payload
  When I create the user via API
  Then the create user response should contain the same username
  When I update the user via API with new details
  Then the update user response should contain the new details
```

### Fluxo de Dados
```
Given: Builder → User object → cy.wrap(user).as('user')
                              → cy.wrap(user.username).as('username')

When: cy.get('@user') → UserApi.createUsersWithList() → ApiBase.request()
                                                      → cy.api()

Then: cy.get('@lastResponse') → UserApiAssertions.validate()
      cy.get('@user') → Compare

Result: test passes ✅
```

---

## 🔄 Reusabilidade entre Domínios

### Compartilhado
- ✅ `ApiBase` - Todas as requisições usam
- ✅ `UrlBuilder` - Qualquer API com placeholders
- ✅ `HeaderFactory` - Headers comuns
- ✅ Steps comuns em `common.steps.ts`

### Específico por Domínio
- 📌 Builders: `PetBuilder`, `UserBuilder`, `OrderBuilder`
- 📌 Page Objects: `PetApi`, `UserApi`, `StoreApi`
- 📌 Assertions: `PetApiAssertions`, `UserApiAssertions`, `StoreApiAssertions`
- 📌 Features: `petstore_api.feature`, `user_api.feature`, `store_api.feature`

---

## ✅ Testes Implementados

### Pet API (5 testes)
- ✅ Create a pet
- ✅ Retrieve a pet
- ✅ Update a pet
- ✅ Delete a pet
- ✅ List and retrieve by ID

### User API (4 testes)
- ✅ Get user by username
- ✅ Create users with list
- ✅ Update user
- ✅ Delete user

### Store API (4 testes)
- ✅ Get inventory
- ✅ Place order
- ✅ Get order by ID
- ✅ Delete order

**Total: 13 testes - Todos passando ✅**

---

## 🚀 Como Executar

### Todos os testes
```bash
npx cypress run --spec "cypress/e2e/api/features/*.feature"
```

### Teste específico
```bash
npx cypress run --spec "cypress/e2e/api/features/user_api.feature"
```

### Modo interativo
```bash
npx cypress open
```

---

## 📦 Extensibilidade

### Adicionar Nova API

#### 1. Criar Type
```typescript
// cypress/types/newEntity.ts
export interface NewEntity {
  id?: number;
  name: string;
  // ...outros campos
}
```

#### 2. Criar Builder
```typescript
// cypress/e2e/api/builders/newEntityBuilder.ts
export class NewEntityBuilder {
  private entity: NewEntity;
  
  withName(name: string) {
    this.entity.name = name;
    return this;
  }
  
  build() {
    return this.entity;
  }
}
```

#### 3. Criar Page Object
```typescript
// cypress/e2e/api/pages/newEntityApi.page.ts
export default class NewEntityApi {
  static create(entity: NewEntity) {
    const url = new UrlBuilder('/v2').build('/newentity');
    return ApiBase.request<NewEntity>('POST', url, HeaderFactory.baseHeaders(), entity);
  }
}
```

#### 4. Criar Assertions
```typescript
// cypress/e2e/api/pages/newEntityApi.assertions.ts
export default class NewEntityApiAssertions {
  static validateCreateResponse(resp: Cypress.Response<NewEntity>) {
    expect(resp.status).to.equal(201);
    expect(resp.body.name).to.exist;
  }
}
```

#### 5. Criar Steps
```typescript
// cypress/e2e/api/stepDefinitions/newEntity.steps.ts
Given('I have a new entity', () => {
  const entity = new NewEntityBuilder().build();
  cy.wrap(entity).as('entity');
});

When('I create the entity via API', () => {
  cy.get<NewEntity>('@entity').then((entity) => {
    NewEntityApi.create(entity).as('lastResponse');
  });
});
```

#### 6. Criar Feature
```gherkin
# cypress/e2e/api/features/newEntity_api.feature
@api @domain-newentity
Scenario: Create new entity
  Given I have a new entity
  When I create the entity via API
  Then the response should be successful
```

---

## 🎯 Benefícios da Arquitetura

### Para Desenvolvedores
- ✅ Código fácil de entender e manter
- ✅ Reutilização reduz duplicação
- ✅ Type-safe com TypeScript
- ✅ Fácil adicionar novos cenários

### Para Testes
- ✅ Determinísticos e confiáveis
- ✅ Rápidos (sem sleep/hardcodes)
- ✅ Escaláveis (funciona com múltiplas APIs)
- ✅ Manuteníveis (mudanças centralizadas)

### Para CI/CD
- ✅ Podem rodar em paralelo
- ✅ Sem dependência entre testes
- ✅ Fáceis de debugar
- ✅ Relatórios claros

---

## 🔐 Princípios Mantidos

1. **Sem Alias para Estado** - Apenas cy.wrap() como intermediário
2. **Sem Dependência de Cypress em Builders** - Builders são POJOs puros
3. **Sem Estado Global** - Cada cenário é independente
4. **Sem Duplicação** - Code reuse máximo
5. **Expressão Clara** - BDD que expressa intenção de negócio

---

## 📚 Referências

- Cypress: https://docs.cypress.io
- Cucumber BDD: https://cucumber.io
- Design Patterns: https://refactoring.guru/design-patterns
- Petstore API: https://petstore.swagger.io

---

## 👥 Contribuindo

Ao adicionar novos testes:

1. Siga a estrutura de pastas
2. Use builders para dados
3. Encapsule endpoints em Page Objects
4. Escreva assertions reutilizáveis
5. Mantenha steps curtos e legíveis
6. Teste para determinismo
7. Documente padrões especiais

