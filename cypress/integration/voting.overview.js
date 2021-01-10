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

    // go to voting page
    cy.get('.nav-link').contains('Plannen')
      .click()

    // check if more then one list item is found
    cy.get('.tile.idea-item.list-item')
      .its('length')
      .should('be.gte', 1)
  });

  it('Navigating with keyboard between ideas', () => {
    // open first item
    cy.get('.gridder-show .this-idea-id')
      .then(($ideaId) => {
        // store the button's text
        return $ideaId.text();
      })
      .then((ideaId) => {
        // Navigating to next idea
        cy.get('body')
        .type('{rightarrow}')

        cy.get('.gridder-show .this-idea-id')
          .should('not.be.empty')
          .should('not.eq', ideaId)
      })

  });

})
