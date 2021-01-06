Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Voting on an idea', () => {

  it('Go to voting site and select a plan', () => {

    // goto site
    cy.visit(Cypress.env('votingSiteUrl'));
  })
})
