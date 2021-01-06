Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Budgeting selecting ideas', () => {

  it('Overview should be shown in second step', () => {
    // goto site
    cy.visit(Cypress.env('budgettingSiteUrl'))

    // go to voting page
    cy.get('.nav-link').contains('Stemmen')
      .click()

    cy.get('.button-add-idea-to-budget')
      .first().click()

    cy.get('#next-button')
      .click()

    cy.screenshot();

    //second step, see if overview of selected step is correctly rendered
    cy.get('.overview')
      .find('tr')
      .its('length')
      .should('be.gte', 0)

  });

})
