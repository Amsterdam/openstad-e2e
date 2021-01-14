/**
 * Testing default overview of submitted plans
 * @Todo many details: combined selections, tags, exclude/include, second areas, progressbar, status
 */
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Overview voting on ideas', () => {

  it('Overview should have more then one submitted idea', () => {
    // goto site
    cy.visit(Cypress.env('votingSiteUrl'))

    // check if more then one list item is found
    cy.get('#ideaList .idea-item')
      .its('length')
      .should('be.gte', 1)
  });



})
