Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Voting on an idea', () => {

  it('Click and open an idea', () => {
    // goto site
    cy.visit(`${Cypress.env('votingSiteUrl')}`, {
      auth: {
          username: Cypress.env('adminBasicAuthUser'),
          password: Cypress.env('adminBasicAuthPass')
      }
    })

      // for some reason we need to login first, otherwise get a security error by cypress
      // because we login in again it's okayish, but prefe
    //  cy.loginUser(Cypress.env('votingSiteUrl'));


      //
      cy.get('#ideaList .idea-item')
        .first()
        .click('topLeft')


      cy.wait(1000)
    //@todo fetch IdeaId and check later on if correct idea is voted on
    //
      // by opening an idea, the vote button should be visible now, and click it
      cy.get('.vote-button:visible')
        .first()
        .click();

      // ideaId should be set
      cy.get('[name="ideaId"]')
        .invoke('val')
        .should('not.be.empty')

      cy.get('#next-button')
        .click();

      // goto site
      cy.get('.validate-auth-button').contains('e-mailadres', {matchCase: false})
        .should('be.visible')
        .click();

       if ( Cypress.env('usePasswordLogin')) {

         cy.get('.btn.btn-primary')
           .contains("Inlog via Wachtwoord")
           .click();

         cy.get('input[name="email"]')
           .type(Cypress.env("defaultUserEmail"))

         cy.get('input[name="password"]')
         .type(Cypress.env("userPassword"))

         cy.get('.btn.btn-primary')
           .click()
       } else {

           // email
         cy.get('input.form-input')
           .type(Cypress.env("defaultUserEmail"))


         // oauth submit
         cy.get('.btn.btn-primary')
           .click()

         cy.wait(6000)

         cy.loginByLatestEmail(Cypress.env("defaultUserMailSlurpInboxId"), false);
       }


       cy.wait(1000)

      // in most case we are reusing the e-mail adress, so only first time
      // @todo create dynamic email address to vote
      // it's posisble with mailslurp, but too many runs per month will push up the costs per month
      // Make sure the validated message is visible
      // In some  bugs a redirect after e-mail verificatioon doesn't redirect back directly to the
      // voting finish button
      cy.contains('Gevalideerd', {matchCase: false})
        .its('length')
        .should('eq', 1)

      cy.wait(1000)

      // click to send vote
      cy.get('#next-button')
        .click();

      cy.wait(1000)

      // Gelukt
      cy.contains('Gelukt, je stem is opgeslagen!', {matchCase: false})
        .its('length')
        .should('eq', 1);
  });
})
