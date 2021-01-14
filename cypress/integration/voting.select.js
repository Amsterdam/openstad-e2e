Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Voting on an idea', () => {

  it('Click and open an idea', () => {
      // goto site
      cy.visit(Cypress.env('votingSiteUrl'));

      //
      cy.get('#ideaList .idea-item')
        .first()
        .click()
  });

  it('Select an idea by clicking on the voting button', () => {
    //@todo fetch IdeaId and check later on if correct idea is voted on
    //
      // by opening an idea, the vote button should be visible now, and click it
      cy.get('.vote-button')
        .contains('stem', {matchCase: false})
        .should('be.visible')
        .click();
  });

  it('Go the next step of voting', () => {
    // ideaId should be set
    cy.get('[name="ideaId"]')
      .invoke('val')
      .should('not.be.empty')

    cy.get('#next-button')
      .click();
  });

  it('Click on verify email', () => {
    // goto site
    cy.get('.validate-auth-button').contains('e-mailadres', {matchCase: false})
      .should('be.visible')
      .click();

      // email
    cy.get('input.form-input')
      .type(Cypress.env("defaultUserEmail"))

    // fetch url, and use default user login logic
    cy.url().then(url => {
      cy.loginUser(url);
    });

    // in most case we are reusing the e-mail adress, so only first time
    // @todo create dynamic email address to vote
    // it's posisble with mailslurp, but too many runs per month will push up the costs per month
    // Make sure the validated message is visible
    // In some  bugs a redirect after e-mail verificatioon doesn't redirect back directly to the
    // voting finish button
    cy.contains('Gevalideerd', {matchCase: false})
      .should('be.visible')

    cy.wait(1000)

    // click to send vote
    cy.get('#next-button')
      .click();

    cy.wait(1000)

    // Gelukt
    cy.contains('Gelukt', {matchCase: false})
      .should('be.visible');
  });
})
