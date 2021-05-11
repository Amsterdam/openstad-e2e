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

const editModBreak = (modBreakText) => {
  cy.contains('Moderator reactie').click();
  cy.get('textarea[name="modBreak"]').clear().type(modBreakText);
  cy.contains('Opslaan').click();
}

const modBreak = `This is a modbreak ${new Date().getTime()}`

describe('Actions of a moderator', () => {

  it('Create a user as an moderator', () => {
      // goto site
      cy.loginModerator(Cypress.env('submittingSiteUrl'));

      cy.visit(`${Cypress.env('submittingSiteUrl')}/admin`, {
        auth: {
            username: Cypress.env('adminBasicAuthUser'),
            password: Cypress.env('adminBasicAuthPass')
        }
      })

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

  it('Edit modbreak as a moderator', () => {
    cy.loginModerator(Cypress.env('submittingSiteUrl'));

    cy.visit(`${Cypress.env('submittingSiteUrl')}/plannen`, {
      auth: {
          username: Cypress.env('adminBasicAuthUser'),
          password: Cypress.env('adminBasicAuthPass')
      }
    })

    cy.get('.tile').first().click();

    editModBreak(modBreak);

    cy.get('#modBreak > p').should('contain', modBreak);
  })

  it('Change status as a moderator', () => {
    cy.loginModerator(Cypress.env('submittingSiteUrl'));

    cy.visit(`${Cypress.env('submittingSiteUrl')}/plannen`, {
      auth: {
          username: Cypress.env('adminBasicAuthUser'),
          password: Cypress.env('adminBasicAuthPass')
      }
    })

    cy.get('.tile').first().click();

    cy.get('select[name="status"]').select('ACCEPTED');

    cy.wait(5000);

    cy.get('button[name="opinion"]').first().should('be.disabled')

    cy.get('select[name="status"]').select('OPEN');

    cy.wait(5000);

    cy.get('button[name="opinion"]').first().should('not.be.disabled')
  })

  it('View and disable likes/votes as a moderator', () => {
    cy.loginModerator(Cypress.env('submittingSiteUrl'));

    cy.visit(`${Cypress.env('submittingSiteUrl')}/plannen`, {
      auth: {
          username: Cypress.env('adminBasicAuthUser'),
          password: Cypress.env('adminBasicAuthPass')
      }
    })

    cy.get('.tile').first().click();

    cy.get('.votes-overview-button').click();

    cy.wait(2000);

    cy.get(':nth-child(1) > .checked > .vote-toggle-form > .link > .vote-approved-text').first().click();

    cy.wait(2000);

    cy.get('.rejected > .checked > .vote-toggle-form > .link > .vote-unapproved-text').first().click();
  })


})
