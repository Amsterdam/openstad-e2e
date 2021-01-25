Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})


let siteId;

const createdSites = [];

const getDefaultSiteFields = () => {
  return [{
    name: 'siteName',
    type: 'text',
    validInput: 'Cypress test' + new Date().getTime()
  },
  {
    name: 'domain',
    type: 'text',
    validInput: 'cy-' + new Date().getTime()
  },
  {
    name: 'fromEmail',
    type: 'text',
    validInput: Cypress.env('senderEmail')
  },
  {
    name: 'fromName',
    type: 'text',
    validInput: Cypress.env('senderName')
  }
]
};

const copySiteFields = [
  {
    name: 'siteIdToCopy',
    type: 'select',
    validInput: Cypress.env('budgettingSiteId')
  }
];

const importSiteFields = [

]

const fillInForm = (siteFields, cy) => {
  siteFields.forEach((field, i) => {
    fillInField(field.name, field.validInput, field.type, cy);
  });
}

const fillInField = (name, value, type, cy) => {
  const fieldRef = cy.get(`[name="${name}"]`);

  if (type === 'text') {
    fieldRef.clear().type(value)
  } else if (type === 'select' || 'checkbox') {
    fieldRef.select(value)
  }
}

const submitForm = (cy) => {
  cy.get('[type="submit"]')
    .first()
    .click();
}

const checkIfSiteCreationIsSuccesfull = (cy) => {
  /**
   * @todo fetch basic auth credentials, test if working, also test change of password
   */
  return Promise((resolve, reject) => {
    cy.url().then(url => {
      cy.log('url', url);

      const siteId = url.substring(url.lastIndexOf('/') + 1);

      cy.log('siteId', siteId);

      resolve(siteId);
    });
  });
};

const navigateToSiteCreatePage = () => {
  cy.visit(Cypress.env('adminUrl'));

  // go to voting page
  cy.get('.btn').contains('Maak nieuwe site aan')
    .click();
}

const setBasicAuthPassword = (cy, siteId, newUser, newPassword) => {
  const editUrl = Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings/basic-auth';

  fillInField('config[basicAuth][user]', newUser, 'text', cy);
  fillInField('config[basicAuth][password]', newPassword, 'text', cy);

  cy.visit(editUrl);

  submitForm(cy);
}

const findUrlAndVisit = (cy, siteId, basicAuthUser, basicAuthPassword) {
  //input should be changed
  cy.visit(Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings');

  // get the site url
  cy.get('[name=productionUrl]')
    .first()
    .invoke('val')
    .then((siteUrl) => {
      // visit site, throws error if basic auth is false
      cy.log('visit site, throws error if basic auth is false');

      const options = basicAuthUser && basicAuthPassword ? {
        auth: {
          username: basicAuthUser,
          password: basicAuthPassword
        }
      } : {}

      cy.visit(siteUrl, options);

      cy.wait(2000)
    })
}

const deleteSite = (cy, siteId) => {
  const settingsUrl = Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings';
  
  cy.visit(settingsUrl);

  cy.log('Delete site');

  cy.wait(1000)

  cy.get('button')
    .contains('Verwijder')
    .click();

  cy.wait(1000)

  cy.log('Finito');
}

// A large test, but contains basic crud of a site
describe('Test settings changes', () => {

  it('Change voting visibility settings of budgettings site',  () => {
    const budgettingSiteId = Cypress.env('budgettingSiteId');

    cy.loginAdminPanel();

    //
    cy.visit(Cypress.env('budgettingSiteUrl'));

    // go to voting page
    cy.get('.btn')
      .contains('Maak nieuwe site')
      .click();

    fillInForm([...getDefaultSiteFields()], cy);

    cy.contains('Begroot')
      .first()
      .click();

    submitForm(cy);

    cy.url()
      .then(url => {
        cy.log('url', url);
        siteId = url.substring(url.lastIndexOf('/') + 1);

        cy.log('Site ID found', siteId);

        //
        const newUser = 'user-' + new Date().getTime();
        const newPassword = 'pw-' + new Date().getTime();

        setBasicAuthPassword(cy, siteId, newUser, newPassword);

        findUrlAndVisit(cy, siteId, newUser, newPassword);

        //input should be changed
        cy.visit(Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings');

        // get the site url
        cy.get('[name=productionUrl]')
          .type()

        deleteSite(cy, siteId)
      });
  });

  it('Test changing url',  () => {
    cy.loginAdminPanel();

    // go to voting page
    cy.get('.btn')
      .contains('Maak nieuwe site')
      .click();

    fillInForm([...getDefaultSiteFields()], cy);

    cy.contains('Lege site')
      .first()
      .click();

    submitForm(cy);

    cy.url()
      .then(url => {
        cy.log('url', url);
        siteId = url.substring(url.lastIndexOf('/') + 1);

        cy.log('Site ID found', siteId);

        const editUrl = Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings/basic-auth';

        cy.get('[name=productionUrl]')
          .first()
          .invoke('val')
          .then((siteUrl) => {

            // visit site, throws error if basic auth is false
            cy.log('change url and site, throws error if basic auth is false');

            const newUrl = 'edit' + siteUrl;

            cy.get('[name=productionUrl]')
              .clear()
              .type(newUrl);

            cy.get('[name=productionUrl]')
              .parents('form')
              .first()
              .submit();

            // see if visit works
            cy.visit(newUrl);

            // see if login
            cy.loginUser(newUrl);

            // clean up and delete
            deleteSite(cy, siteId);
          })

      });
  });

})
