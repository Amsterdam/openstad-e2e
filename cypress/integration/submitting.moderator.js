Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

const fillInField = (name, value, type, cy) => {
  const fieldRef = cy.get(`[name="${name}"]`);

  if (type === 'text') {
    fieldRef.first().clear({force: true}).type(value, {force: true})
  } else if (type === 'select' || 'checkbox') {
    fieldRef.first().select(value, {force: true})
  }
}

describe('Actions of a moderator', () => {

  it('Create a user as an moderator', () => {
      // goto site
      cy.loginAdmin(Cypress.env('submittingSiteUrl'));

      cy.visit(Cypress.env('submittingSiteUrl') + '/admin');

      const email = new Date().getTime() + 'user@' + Cypress.env('trustedEmailDomain');
      const password = new Date().getTime() + Cypress.env('adminPassword');
      const firstName = 'First Name '+ new Date().getTime();
      const lastName = 'Last Name '+ new Date().getTime();
      const postcode = 'Postcode '+ new Date().getTime();

      cy.wait(1000);

      cy.get('main a')
        .contains('Gebruikers')
        .first()
        .click({force:true});

      cy.get('a')
        .contains('Create')
        .first()
        .click({force: true});

      fillInField('email', email, 'text', cy);
      fillInField('firstName', firstName, 'text', cy);
      fillInField('lastName', lastName, 'text', cy);
      fillInField('zipCode', postcode, 'text', cy);

      // like the plan
      cy.get('form button[type="submit"]')
        .first()
        .click();

      cy.wait(200);

  });


})