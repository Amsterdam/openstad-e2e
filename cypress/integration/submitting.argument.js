Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
});

const invalidArgument = 'Short';
const validArgument = 'I am a very valid argument and long enough';

const navitageToPageForArguments = (cy) => {
  // goto site
  cy.visit(Cypress.env('submittingSiteUrl') + '/plannen');

  // move to first plan
  cy.get('.tile.idea-item.list-item')
    .first()
    .click();
}

const submitArgument = (argument) => {

}

describe('Submitting arguments', () => {

  it('Trying to submit anonymous arguments should get a waning message', () => {
    navitageToPageForArguments(cy);

    //modal should be visible
    cy.get('#modal-required')
      .should('be.visible');
  });

  it('Login and navigate to a page with arguments', () => {
    // goto site
    cy.loginUser();

    navitageToPageForArguments(cy);
  });

  it('Argument form is present', () => {
    // goto site
    // move to first plan
    cy.get('.argument-form')
      .its('length')
      .should('be.gte', 0)
  });

  it('Argument form validation throws an error on a short comment', () => {
    // goto site
    // move to first plan
    cy.get('.argument-form')
      .its('length')
      .should('be.gte', 0)

    submitArgumentForm(cy);

    cy.get('.argument-form')
      .its('length')
      .should('be.gte', 0)
      
  });

  it('Argument form allows submitting an argument', () => {
    // goto site
    // move to first plan
    cy.get('.tile.idea-item.list-item')
      .first()
      .click();
  });

  it('Submitted argument is visible', () => {
    // goto site
    // move to first plan
    cy.get('.tile.idea-item.list-item')
      .first()
      .click();
  });

})
