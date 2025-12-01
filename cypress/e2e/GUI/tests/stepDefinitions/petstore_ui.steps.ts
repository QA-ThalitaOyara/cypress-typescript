import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import PetUi from '../pages/petUi.page';

Given('que eu abro a Swagger UI do Petstore', () => {
  PetUi.visit();
});

Then('eu devo ver a seção ou referência a "pet"', () => {
  PetUi.findText('pet').should('exist');
});

Then('devo ver que a UI está carregada', () => {
  PetUi.getMainContainer().should('exist');
});
