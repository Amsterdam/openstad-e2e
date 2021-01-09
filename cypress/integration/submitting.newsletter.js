Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Budgeting selecting ideas', () => {

  it('Overview should be shown in second step', () => {
    // goto site
    cy.visit(Cypress.env('submittingSiteUrl'))

    // go to newsletter
    cy.get('a').contains('Hou mij op de hoogte')
      .click();


  });

})
