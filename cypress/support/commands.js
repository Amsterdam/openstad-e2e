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


Cypress.Commands.add("login", (authUrl, emailAddress, inboxId, basicAuth) => {
  // directly go to login url
  // /login redirects to auth server
  cy.visit(authUrl);

  // email
  cy.get('input.form-input')
    .type(emailAddress)

  // oauth submit
  cy.get('.btn.btn-primary')
    .click()

   cy.wait(6000)

   cy.loginByLatestEmail(inboxId, basicAuth);
});

Cypress.Commands.add("loginByLatestEmail", (inboxId, basicAuth) => {
  return cy.waitForLatestEmail(inboxId).then((receivedEmail) => {
    // add http/s? Test only works with https urls, not local http urls, fine for now
  //    var urlExpression = /href="(.*?)"/g;
    var urlExpression = /href="(.*?)"/g

    // extract the login url (so we can confirm the user)
    var testUrl = urlExpression.exec(receivedEmail.body), //receivedEmail.body.match(urlExpression),
        onlyUrl = testUrl && testUrl[1];

    // for some reason email body doesn't have correct ampersand in url, search and replace
    onlyUrl = onlyUrl.replace(/&amp;/g, '&');

    cy.log('go to auth url', onlyUrl);

  //  return cy.visit('https://www.google.com');
    const options = basicAuth ? basicAuth : {
      auth: basicAuth
    };

    // basicAuth is mainly for end url, in this setup it's encoded in the returnto url
    // we need to pass the credentials in the url otherwise we get a basic auth popup and it blocks the test
    // @TODO currently this fails because API fails on the login, need to debug why
    if (basicAuth) {
      const pieceToReplace = 'returnTo%3Dhttps%3A%2F%2F';
      // add the : and @ in urlencoded chars
      const urlBasicAuth = `${basicAuth.user}%3A${basicAuth.pass}%40`;
      const pieceWithBasicAuth = `${pieceToReplace}${urlBasicAuth}`;

      onlyUrl = onlyUrl.replace(pieceToReplace, pieceWithBasicAuth);
    }

    return cy.visit(onlyUrl, options);
  });
});


Cypress.Commands.add("loginUser", (url) => {
  // directly go to login url
  // /login redirects to auth server
  url = url + '/login' ;
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

Cypress.Commands.add("loginAdminPanel", () => {

  // directly go to login url
  // /login redirects to auth server
  let url = Cypress.env('adminUrl') + '/admin/oauth/login';

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
