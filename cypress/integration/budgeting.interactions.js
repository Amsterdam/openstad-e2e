Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Budgeting selecting ideas', () => {

  it('Adding and removing button', () => {
    // goto site
    cy.visit(Cypress.env('budgettingSiteUrl'))

    // go to voting page
    cy.get('.nav-link').contains('Stemmen')
      .click()

    cy.get('.button-add-idea-to-budget')
      .first()
      .click()

    cy.get('.button-add-idea-to-budget')
      .should('have.class','added')

   //click it again, this should remove added class
    cy.get('.button-add-idea-to-budget')
      .first()
      .click();

    cy.get('.button-add-idea-to-budget')
      .should('not.have.class','added')
  });

  it('Minimum amount not reached next step not allowed', () => {
    //click it again, this should remove added class
     cy.get('.button-add-idea-to-budget')
       .first()
       .click();
  });

  it('Removing an idea in top', () => {
    //click it again, this should remove added class
     cy.get('.button-add-idea-to-budget')
       .first()
       .click();
  });

  it('Navigating with Keyboard', () => {
    //click it again, this should remove added class
     cy.get('.button-add-idea-to-budget')
       .first()
       .click();
  });

  it('Minimum reached next step allowed', () => {
    //click it again, this should remove added class
     cy.get('.button-add-idea-to-budget')
       .first()
       .click();
  });

})
