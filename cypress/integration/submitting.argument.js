Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
});


const navigateToPageForArguments = (cy, doLogin) => {

  if (doLogin) {
    // goto site
    cy.visit(`${Cypress.env('submittingSiteUrl')}`, {
      auth: {
        username: Cypress.env('adminBasicAuthUser'),
        password: Cypress.env('adminBasicAuthPass')
      }
    })
    cy.loginUser(Cypress.env('submittingSiteUrl'));
  }
  
  // goto idea page
  cy.visit(`${Cypress.env('submittingSiteUrl')}/plannen`, {
    auth: {
        username: Cypress.env('adminBasicAuthUser'),
        password: Cypress.env('adminBasicAuthPass')
    }
  })

  // move to first plan
  cy.get('.tile.idea-item.list-item')
    .first()
    .click();
}

const validArgument = 'This is a very valid point, and I would like you to agree with me';
const editedArgument = 'This is an edited argument thats long enough';
const invalidArgument = 'Too short';

const submitArgument = (cy, argument, which) => {

  let form = which;
  if (typeof which == 'string' || typeof which == 'undefined' ) {
    const formIndex = which == 'against' ?  1 : 0;
    form = cy.get(`.osc-reactions`)
      .eq(formIndex)
  }

  form.within(() => {

    cy.get('textarea')
    .focus()
    .clear()
    .type(argument);

    cy.wait(1000)

    cy.get(`.osc-button-blue`)
      .click();

    cy.wait(1000)

  })

}

describe('Submitting arguments', () => {

  const timestampedArgument = new Date().getTime() + ' ' + validArgument;
  const timestampedReply = new Date().getTime() + ' a reply ' + validArgument;
  const againstArgument = new Date().getTime() + ' against ' + validArgument;

  it('Submit, reply-to and delete arguments for', () => {

    cy.log('Login and navigate to a page with arguments');

    navigateToPageForArguments(cy, true);

    cy.log('Argument form validation throws an error on a short comment')

    submitArgument(cy, invalidArgument);
    cy.get('.osc-form-warning')
      .should('contain', 'De tekst is te kort')

    cy.log('Argument for form allows submitting an argument');

    const timestampedArgument = new Date().getTime() + ' ' + validArgument;
    submitArgument(cy, timestampedArgument);

    cy.wait(1000)

    // check if argument is on page
    cy.contains(timestampedArgument)
      .its('length')
      .should('eq', 1);

    cy.log('Make a reply');

    const timestampedReply = new Date().getTime() + ' a reply ' + validArgument;

    cy.get(`.osc-reply-button`)
      .first()
      .click();

    cy.wait(500)

    let form = cy.get(`.osc-reply`)
    submitArgument(cy, timestampedReply, form);

    cy.wait(1000)

    // check if reply argument is on page
    cy.contains(timestampedReply)
      .its('length')
      .should('eq', 1);

    cy.log('Edit an argument');

    const timestampedEditedArgument = new Date().getTime() + ' a reply ' + editedArgument;

    cy.get(`.osc-reaction`).within(() => {
      cy.get(`.osc-reaction-menu`)
        .first()
        .click();

      cy.get(`.osc-reaction-edit`)
        .first()
        .click();

      form = cy.get(`.osc-reaction-description`)
        .first()
      submitArgument(cy, timestampedEditedArgument, form);
    })
    
    // check if edited argument is on page
    cy.contains(timestampedEditedArgument)
      .its('length')
      .should('eq', 1);

    cy.log('Delete argument');
    
    cy.get(`.osc-reaction-menu`)
      .first()
      .click();

    cy.get(`.osc-reaction-delete`)
      .first()
      .click();

    cy.wait(1000)

    // check if edited argument is deleted
    cy.contains(timestampedReply)
      .should('not.exist');

    cy.wait(1000)

    cy.log('Argument against form allows submitting an argument');

    submitArgument(cy, againstArgument, 'against');
    cy.wait(1000);

  });

  it('Submit, vote-on and delete arguments against', () => {

    navigateToPageForArguments(cy);

    cy.get('.osc-reaction-like-button')
      .first()
      .click();

    cy.wait(1000)

    //modal should be visible
    cy.get('.osc-modal-popup-content')
      .last()
      .should('be.visible');

    cy.get('.osc-modal-popup-buttons button')
      .contains('Inloggen')
      .click();

    cy.loginUserWithPassword(Cypress.env('defaultUserEmail'), Cypress.env('userPassword'));
    cy.wait(1000)

    cy.get('.osc-reaction-like-button')
      .first()
      .click();

    cy.reload()

    cy.log('Delete an argument');

    cy.get(`.osc-reaction-menu`)
      .first()
      .click();

    cy.get(`.osc-reaction-delete`)
      .first()
      .click();

    cy.wait(1000)

    cy.reload()
    // check if edited argument is deleted
    cy.contains(againstArgument).should('not.exist');
  })


})
