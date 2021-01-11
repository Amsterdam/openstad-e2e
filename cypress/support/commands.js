// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// cypress/support/commands.js
const { MailSlurp } = require("mailslurp-client");

Cypress.Commands.add("waitForLatestEmail", (inboxId) => {
  const mailslurp = new MailSlurp({ apiKey: Cypress.env("mailSlurpApiKey") });
  return mailslurp.waitForLatestEmail(inboxId);
});

Cypress.Commands.add("login", (authUrl, emailAddress, inboxId) => {
  // directly go to login url
  // /login redirects to auth server
  cy.visit(authUrl);

  // email
  cy.get('input.form-input')
    .type(emailAddress)

  // oauth submit
  cy.get('.btn.btn-primary')
    .click()

   cy.wait(10000)

  return cy.waitForLatestEmail(inboxId).then((receivedEmail) => {
    console.log('receivedEmail', receivedEmail.body);

    // add http/s? Test only works with https urls, not local http urls, fine for now
//    var urlExpression = /href="(.*?)"/g;
    var urlExpression = /href="(.*?)"/g

    // extract the login url (so we can confirm the user)
    var testUrl = urlExpression.exec(receivedEmail.body), //receivedEmail.body.match(urlExpression),
        onlyUrl = testUrl && testUrl[1];

    console.log('onlyUrl1', onlyUrl);

    onlyUrl = onlyUrl.replace(/&amp;/g, '&');
    console.log('onlyUrl2', onlyUrl);

    cy.log('go to auth url', onlyUrl);

  //  return cy.visit('https://www.google.com');
    return cy.visit(onlyUrl);
//return cy.visit(onlyUrl);
    // { subject: '...', body: '...' }
  });
});

Cypress.Commands.add("loginUser", (url) => {
  // directly go to login url
  // /login redirects to auth server
  url = url + '/login';
  return cy.login(url, Cypress.env("defaultUserEmail"), Cypress.env("defaultUserMailSlurpInboxId"));
});

Cypress.Commands.add("loginModerator", (url, email) => {
  // directly go to login url
  // admin url always allows e-mail authentication
  cy.visit(url + '/admin/login')
  return cy.login(url, Cypress.env("moderatorUserEmail"), Cypress.env("moderatorUserMailSlurpInboxId"));
});

Cypress.Commands.add("loginAdmin", (url, email) => {
  // directly go to login url
  // /login redirects to auth server
  cy.visit(url + '/admin/login')
  return cy.login(url, Cypress.env("adminUserEmail"), Cypress.env("adminUserMailSlurpInboxId"));
});

Cypress.Commands.add("loginAdminPanel", (url, email) => {
  // directly go to login url
  // /login redirects to auth server
  cy.visit(Cypress.env('adminUrl') + '/admin/oauth/login')
  return cy.login(url, Cypress.env("adminUserEmail"), Cypress.env("adminUserMailSlurpInboxId"));
});


Cypress.Commands.add(
  'dropFile',
  {
    prevSubject: false
  },
  (fileName) => {
    Cypress.log({
      name: 'dropFile'
    });
    return cy
      .fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then((blob) => {
        // instantiate File from `application` window, not cypress window
        return cy.window().then((win) => {
          const file = new win.File([blob], fileName);
          const dataTransfer = new win.DataTransfer();
          dataTransfer.items.add(file);
          return cy.document().trigger('drop', {
            dataTransfer
          });
        });
      });
  }
);

Cypress.Commands.add("selectNth", (select, pos) => {
  cy.get(`${select} option +option`)
    .eq(pos)
    .then( e => {
      cy.log(select);
      cy.log(e.val());

       cy.get(select)
         .select(e.val())
    })
})
