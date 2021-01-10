Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
});

describe('Budgeting selecting ideas', () => {

  it('Open newsletter modal', () => {
    // goto site
    cy.visit(Cypress.env('submittingSiteUrl'))

    // go to newsletter
    cy.get('a').contains('Hou mij op de hoogte')
      .click();
  });

  it('Subscribe with fresh e-mail', () => {
    // add time
    const freshEmailAddress = new Date().getTime() + 'newslettertest@' + Cypress.env('trustedEmailDomain');
    const usedEmailAddress = 'newslettertest@' + Cypress.env('trustedEmailDomain');
    const firstName = 'First name';

    cy.get('[name="firstName"]')
      .type(firstName)

    cy.get('[name="email"]')
      .type(freshEmailAddress)

    // currently captcha is easily stepped passed by just removing then
    // areYouABot field, this works now because bots don't bother breaking down our specific spam
    // in case we start receiving spam again we need something a bit stronger
    cy.get('[name="areYouABot"]')
      .invoke('remove')

    cy.get('[type="submit"]')
      .click();

    cy.get('.error-message')
      .should('not.be.visible')

    cy.get('.success-message')
      .should('be.visible')
  });

  it('Subscribe with a used e-mail', () => {
    // add time
    const usedEmailAddress = 'newslettertest@' + Cypress.env('trustedEmailDomain');
    const firstName = 'First name';

    cy.get('[name="firstName"]')
      .clear()
      .type(firstName)

    cy.get('[name="email"]')
      .clear()
      .type(usedEmailAddress)

    cy.get('[type="submit"]')
      .click();

    cy.get('.error-message')
      .should('be.visible')

    cy.get('.success-message')
      .should('not.be.visible')
  });


})
