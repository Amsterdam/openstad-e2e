Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Voting on an idea', () => {

  it('Select a plan', () => {

    // goto site
    cy.visit(Cypress.env('votingSiteUrl'));

    .should()
  });

  it('Go the next step', () => {

    // goto site
    cy.visit(Cypress.env('votingSiteUrl'));

    .should()
  });

  it('Authenticate with email', () => {

    // goto site
    cy.visit(Cypress.env('votingSiteUrl'));

    .should()
  });


})
