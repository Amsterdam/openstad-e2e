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

// A large test, but contains basic crud of a site
describe('Filling, validating, submitting, editing, deleting a site', () => {
  it('Copy a site',  () => {
    cy.loginAdminPanel();

    cy.log('Go to copy page');

    // go to voting page
    cy.contains('Kopieer site')
      .click();

    cy.wait(1000);

    cy.log('Copy a site');

    fillInForm([...getDefaultSiteFields(), ...copySiteFields], cy)

    cy.wait(1000);

    submitForm(cy);
  });

  it('Create site and change basic ',  () => {
    cy.loginAdminPanel();

    // go to voting page
    cy.get('.btn')
      .contains('Maak nieuwe site')
      .click();

    fillInForm([...getDefaultSiteFields()], cy);

    cy.contains('Participatief begroten')
      .first()
      .click();

    submitForm(cy);

    cy.url()
      .then(url => {
        cy.log('url', url);
        siteId = url.substring(url.lastIndexOf('/') + 1);

        cy.log('Site ID Latest', siteId);

        const editUrl = Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings/basic-auth';
        cy.visit(editUrl);

        const newUser = 'user-' + new Date().getTime();
        const newPassword = 'pw-' + new Date().getTime();

        fillInField('config[basicAuth][user]', newUser, 'text', cy);
        fillInField('config[basicAuth][password]', newPassword, 'text', cy);

        submitForm(cy);

        //input should be changed
        cy.visit(Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings');

        cy.wait(1000)

        // get the site url
        cy.get('[name=productionUrl]')
          .first()
          .invoke('val')
          .then((siteUrl) => {
            // visit site, throws error if basic auth is false
            cy.log('visit site, throws error if basic auth is false');

            cy.visit(siteUrl, {
              auth: {
                username: newUser,
                password: newPassword
              }
            });

            cy.wait(2000)

            const settingsUrl = Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings';
            cy.visit(settingsUrl);

            cy.log('Delete site ');

            cy.wait(1000)

            cy.get('button')
              .contains('Verwijder')
              .click();

            cy.wait(1000)

            cy.log('Finito');
          })
      });

  });


})
