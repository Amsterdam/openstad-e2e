Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Submitting arguments', () => {

  it('Trying to submit anonymous arguments should get a waning message', () => {
    // goto site
    cy.visit(Cypress.env('submittingSiteUrl') + '/plannen');

    // move to first plan
    cy.get('.tile.idea-item.list-item')
      .first()
      .click();

    //modal should be visible
    cy.get('#modal-required')
      .should('be.visible');
  });

  it('Can', () => {
    // goto site
    cy.visit(Cypress.env('submittingSiteUrl') + '/plannen');

    // move to first plan
    cy.get('.tile.idea-item.list-item')
      .first()
      .click();

  });

})
