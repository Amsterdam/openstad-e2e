Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Submitting rendering ideas', () => {

  it('Overview should have more then one submitted idea', () => {
    // goto site
    cy.visit(Cypress.env('submittingSiteUrl'))

    // go to voting page
    cy.get('.nav-link').contains('Plannen')
      .click()

    // check if more then one list item is found
    cy.get('.tile.idea-item.list-item')
      .its('length')
      .should('be.gte', 1)

  });

})
