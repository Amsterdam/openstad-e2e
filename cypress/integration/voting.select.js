Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Voting on an idea', () => {

  it('Go to voting site and select a plan', () => {

    // goto site
    cy.visit(Cypress.env('submittingSiteUrl'))

    // goto plannen
    cy.contains('Inloggen')
      .click()

    // email
    cy.get('input.form-input')
      .type(Cypress.env('loginEmail'))

    // oauth submit
    cy.get('.btn.btn-primary')
      .click()

    // check flassh message
    cy.get('.flash-message__content')
      .should('have.text', '\n      De e-mail is verstuurd naar: ' + Cypress.env('loginEmail') + '\n    ')

  })
})
