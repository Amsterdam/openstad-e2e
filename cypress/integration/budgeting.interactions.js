Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Budgeting selecting ideas', () => {

  it('Addding and removing button should work', () => {
    // goto site
    cy.visit(Cypress.env('budgettingSiteUrl'))

    // go to voting page
    cy.get('.nav-link').contains('Stemmen')
      .click()

    cy.get('.button-add-idea-to-budget')
      .first().click()

    cy.get('.button-add-idea-to-budget')
      .should('have.class','added')

   //click it again, this should remove added class
    cy.get('.button-add-idea-to-budget')
      .first().click()

    cy.get('.button-add-idea-to-budget')
      .should('not.have.class','added')

  });

})
