Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
});

const fillInField = (name, value, type, cy) => {
  const fieldRef = cy.get(`[name="${name}"]`);

  if (type === 'text') {
    fieldRef.clear().type(value)
  } else if (type === 'select' || 'checkbox') {
    fieldRef.select(value)
  }
}

describe('Testing users in admin panel', () => {

  it('Create, login, delete user', () => {
    cy.loginAdminPanel();

    // go to voting page
    cy.get('a')
      .contains('Gebruikers')
      .click();

    cy.get('a')
      .contains('Nieuw')
      .click();


    const email = new Date().getTime() + 'user@' + Cypress.env('trustedEmailDomain');
    const password = new Date().getTime() + Cypress.env('adminPassword');
    const firstName = 'First Name '+ new Date().getTime();
    const lastName = 'Last Name '+ new Date().getTime();
    const postcode = 'Postcode '+ new Date().getTime();

    fillInField('email', email, 'text', cy);
    fillInField('password', password, 'text', cy);

    cy.get('[type="submit"]')
      .first()
      .click();

    cy.logout();

    cy.visit(Cypress.env('submittingSiteUrl') + '/login');

    cy.loginUserWithPassword(email, password);

    cy.fillInRequiredUserFields([
      {
        name: 'firstName',
        value: firstName
      },
      {
        name: 'lastName',
        value: lastName
      },
    /*  {
        name: 'postcode',
        value: postcode
      }*/
    ]);

    cy.logout();

    cy.loginAdminPanel();

    cy.get('a')
      .contains('Gebruikers')
      .click();

    cy.get('input[type="search"]')
      .type(email);

    cy.wait(200);

    cy.contains('Edit')
      .first('click')

    cy.get(`roles['${Cypress.env('budgettingSiteId')}']`)
      .first()
      .click();

    cy.get('[type="submit"]')
      .first()
      .click();

    //make user moderator
    cy.logout();

    cy.visit(Cypress.env('submittingSiteUrl') + '/admin/login');

    cy.loginUserWithPassword(email, password);

    cy.logout();

    cy.loginAdminPanel();

    cy.get('a')
      .contains('Gebruikers')
      .click();

    cy.get('input[type="search"]')
      .type(email);

    cy.wait(200);

    // @todo, currently no DELETE possible in admin panel
    cy.contains('Edit')
      .first('click');
  });
})
