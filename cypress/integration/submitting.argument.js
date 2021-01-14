Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
});


const navitageToPageForArguments = (cy) => {
  // goto site
  cy.visit(Cypress.env('submittingSiteUrl') + '/plannen');

  // move to first plan
  cy.get('.tile.idea-item.list-item')
    .first()
    .click();
}


const validArgument = 'This is a very valid point, and I would like you to agree with me';

const editedArgument = 'This is an edited argument thats long enough';

const invalidArgument = 'Too short';

const submitArgument = (cy, argument, forArgument = true) => {
  const formIndex = forArgument ? 0 : 1;

  cy.get(`.arguments-cta-box .argument-form textarea`)
    .eq(formIndex)
    .focus()
    .clear()
    .type(argument);

  cy.wait(1000)

  cy.get(`.arguments-cta-box .argument-form [type="submit"]`)
    .eq(formIndex)
    .click();

  cy.wait(1000)

}

describe('Submitting arguments', () => {

  it('Trying to submit anonymous arguments should get a waning message', () => {
    navitageToPageForArguments(cy);

    cy.get('.argument-form textarea')
      .eq(0)
      .click();

    cy.wait(1200)

    //modal should be visible
    cy.get('#login-required')
      .should('be.visible');
  });

  it('Login and navigate to a page with arguments', () => {
    // goto site
    cy.loginUser(Cypress.env('submittingSiteUrl'));
    navitageToPageForArguments(cy);

    cy.log('Argument form validation throws an error on a short comment')


    submitArgument(cy, invalidArgument);

    cy.wait(1000)

    cy.get('.argument-form:eq(0) label.error')
      .its('length')
      .should('eq', 1)

    cy.log('Argument for form allows submitting an argument');
    const timestampedArgument = new Date().getTime() + ' ' + validArgument;

    submitArgument(cy, timestampedArgument);

    cy.wait(500)

    // check if argument is on page
    cy.contains(timestampedArgument)
      .its('length')
      .should('eq', 1);

    cy.log('Make a reply');

    const timestampedReply = new Date().getTime() + ' a reply ' + validArgument;

    cy.get(`.argument-container .reply`)
      .first()
      .click();

    cy.get(`.reply-form:visible textarea[name="description"]`)
      .first()
      .clear()
      .type(timestampedReply);

    cy.get(`.reply-form:visible [type="submit"]`)
      .first()
      .click();

    cy.wait(500)

    // check if edited argument is on page
    cy.contains(timestampedReply)
      .its('length')
      .should('eq', 1);

    cy.log('Make an edit');

    const timestampedEditedArgument = new Date().getTime() + ' a reply ' + editedArgument;

    cy.get(`.argument-container .edit`)
      .siblings('.user')
      .first()
      .get(`.edit`)
      .first()
      .click();

    cy.get(`.argument-edit-form:visible textarea[name="description"]`)
      .first()
      .clear()
      .type(timestampedEditedArgument);

    cy.get(`.argument-edit-form:visible [type="submit"]`)
      .first()
      .click();

    // check if edited argument is on page
    cy.contains(timestampedEditedArgument)
      .its('length')
      .should('eq', 1);


    cy.wait(500)

    cy.log('Delete an argument');

    cy.wait(500)

    cy.contains(timestampedEditedArgument)
      .siblings('.user')
      .first()
      .get(`.delete`)
      .first()
      .submit();

    cy.wait(500)

    // check if edited argument is deleted
    cy.contains(timestampedEditedArgument)
      .its('length')
      .should('eq', 0);

    cy.log('Argument against form allows submitting an argument');

    const againstArgument = new Date().getTime() + ' against ' + validArgument;

    submitArgument(cy, againstArgument, false)

    cy.contains(againstArgument)
      .siblings('.user')
      .first()
      .get(`.delete`)
      .first()
      .submit();

  });


})
