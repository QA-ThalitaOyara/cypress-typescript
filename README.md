# Cypress + Cucumber + TypeScript

This project is scaffolded to use `cypress` v14.4.0 with the `@badeball/cypress-cucumber-preprocessor` and `esbuild` bundler.

## Rodando os exemplos de API e UI (features)

- Instale dependências (se ainda não):

```powershell
npm install
```

- Abrir o Cypress (UI):

```powershell
npx cypress open
```

- Executar todos os testes headless:

```powershell
npx cypress run
```

- Executar apenas features (caso seu projeto use um preprocessor Cucumber):

```powershell
npx cypress run --spec "cypress/e2e/**/features/*.feature"
```

Observações:
- Os exemplos usam a API pública do Swagger Petstore (`https://petstore.swagger.io`).
- Certifique-se que o preprocessor Cucumber está configurado no projeto para que arquivos `.feature` e `stepDefinitions` sejam reconhecidos.


Install dependencies (PowerShell):

```powershell
npm install
```

Open Cypress UI:

```powershell
npm run cypress:open
```

Run headless:

```powershell
npm run cypress:run
```

Notes:
- `specPattern` is configured to pick up `**/*.feature` files.
- TypeScript `tsconfig.json` sets `moduleResolution` to `node16` for compatibility with the preprocessor.
