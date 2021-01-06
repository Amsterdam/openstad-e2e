Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Plan insturen', () => {

  it('Stuur een nieuw plan in', () => {

    // goto site
    cy.visit(Cypress.env('siteUrl'))

    // check flassh message
    cy.contains('Plannen')
      .should('have.text', 'Dit doet nog niets')
  })
})
