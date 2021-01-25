Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Voting on an idea', () => {

  it('Edit an idea as moderator', () => {
      // goto site
      cy.loginModerator(Cypress.env('votingSiteUrl'));

      cy.get('#ideaList .idea-item')
        .first()
        .click('topLeft');

      cy.get('a')
        .contains('Bewerk')
        .first()
        .click();

      const timestampedTitle = new Date().getTime() + ' I am a valid title';

      cy.get('input[name="title"]')
        .clear()
        .type(timestampedTitle);

      // like the plan
      cy.get('.resource-form [type="submit"]')
        .click();

      cy.wait(200);

      // make sure edited title is found
      cy.contains(timestampedTitle)
        .its('length')
        .should('be.gte', 0)
  });

  it('Export ideas moderator', () => {
      // goto site
      cy.loginModerator(Cypress.env('votingSiteUrl'));

      cy.visit(Cypress.env('votingSiteUrl') + '/admin');

      cy.contains('Ideas')
        .first()
        .click();

      cy.contains('Export')
        .first()
        .click();

      // expected rows?
      // @todo how to check CSV

      // @todo import
  });

})
