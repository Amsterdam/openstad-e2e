Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

const budgettingSiteId =  Cypress.env('budgettingSiteId');

describe('Testing moderator actions for budgetting site', () => {

  it('Export ideas from budgetting', () => {
      cy.loginModerator(Cypress.env('budgettingSiteUrl'));

      cy.visit(`${adminUrl}/admin`);

      cy.contains('Ideas')
        .first()
        .click();

        // @todo how to check CSV is valid?
  });

  // now only possible as admin, is something will be added to site management later
  //  and moderator actions, so even though not possible for a moderator now, it is a "moderator" test
  it('Export unique codes admin', () => {
      // goto site
      cy.loginAdminPanel();

      cy.visit(`${adminUrl}/admin/site/${budgettingSiteId}/unique-codes`);

      cy.get('a')
        .contains('Export unique codes')
        .click();

      // @todo how to check CSV is valid?

      // @todo import
  });

})
