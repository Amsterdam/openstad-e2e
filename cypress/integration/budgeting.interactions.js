Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Budgeting selecting ideas', () => {

  it('Adding and removing button', () => {
    // goto site
    cy.visit(`${Cypress.env('budgettingSiteUrl')}`, {
      auth: {
          username: Cypress.env('adminBasicAuthUser'),
          password: Cypress.env('adminBasicAuthPass')
      }
    })

    // go to voting page
    cy.get('.nav-link').contains('Stemmen')
      .click()

    cy.wait(300)

    cy.get('.button-add-idea-to-budget')
      .first()
      .click()

    cy.wait(300)

    cy.get('.button-add-idea-to-budget')
      .should('have.class','added')

    cy.wait(300)

    //click it again, this should remove added class
    cy.get('.button-add-idea-to-budget')
      .first()
      .click();

    cy.get('.button-add-idea-to-budget')
      .should('not.have.class','added')
  });

})
