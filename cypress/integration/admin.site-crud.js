Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

const createdSites = [];

const getDefaultSiteFields = () => {
  return [{
    name: 'siteName',
    type: 'text',
    validInput: 'Test Site ' + new DateTime().getTime()
  },
  {
    name: 'domain',
    type: 'text',
    validInput: 'test-site-' + new DateTime().getTime()
  }]
};

const copySiteFields = [
  {

  }
];

const createSubmitSiteFields = [
  {

  }
];

const createBudgettingSiteFields = [
  {

  }
];

const createEmptySiteFields = [
  {

  }
];

const createVoteSiteFields = [
  {

  }
];

const importSiteFields = [

]

const fillInForm = (siteFields, cy) => {
  siteFields.forEach((field, i) => {
    fillInField();
  });
}

const fillInField = (name, value, type, cy) => {
  const fieldRef = cy.get(`[name="${name}"]`);

  if (type === 'text') {
    fieldRef.type(value)
  } else if (type === 'select' || 'checkbox') {
    fieldRef.select(value)
  }
}

const submitForm = (cy) => {
  cy.get('[type="submit"]')
    .first()
    .click();
}

const checkIfSiteCreationIsSuccesfull = (ct) => {
  /**
   * @todo fetch basic auth credentials, test if working, also test change of password
   */

};

const navigateToSiteCreatePage = () => {
  cy.visit(Cypress.env('adminUrl'));

  // go to voting page
  cy.get('.btn').contains('Nieuw');
    .click();
}

// A large test, but contains basic crud of a site
describe('Filling, validating, submitting, editing, deleting a site', () => {
  it('Login succesfull', () => {
    cy.loginAdmin(Cypress.env('adminUrl'));

    cy.get('.title')
      .should('have.text', 'Sites');
  });

  it('Copy a site', () => {
    cy.visit(Cypress.env('adminUrl'));

    // go to voting page
    cy.get('.btn').contains('Kopieer');
      .click();

    fillInForm([...siteFields, ...copySiteFields], cy);

    // should expect correct redirect to new site
    submitForm(cy);

    checkIfSiteCreationIsSuccesfull(cy);

    // should expect correct redirect to new site
    const siteId = checkIfSiteCreationIsSuccesfull();

    if (siteId) {
      createdSites.push(siteId);
    }
  });

  it('Create a new budgetting site', () => {
    navigateToSiteCreatePage(cy)

    fillInForm([...getDefaultSiteFields(), ...createBudgettingSiteFields], cy);

    submitForm(cy);

    checkIfSiteCreationIsSuccesfull(cy);

    // should expect correct redirect to new site
    const siteId = checkIfSiteCreationIsSuccesfull();

    if (siteId) {
      createdSites.push(siteId);
    }
  });

  it('Create a new submit site', () => {
    navigateToSiteCreatePage(cy);

    //fill in form
    fillInForm([...getDefaultSiteFields(), ...createSubmitSiteFields], cy);

    checkIfSiteCreationIsSuccesfull();

    // should expect correct redirect to new site
    const siteId = checkIfSiteCreationIsSuccesfull();

    if (siteId) {
      createdSites.push(siteId);
    }
  });

  it('Create a new vote site', () => {
    navigateToSiteCreatePage(cy);

    //fill in form
    fillInForm([...getDefaultSiteFields(), ...createVoteSiteFields], cy);

    checkIfSiteCreationIsSuccesfull();

    // should expect correct redirect to new site
    const siteId = checkIfSiteCreationIsSuccesfull();

    if (siteId) {
      createdSites.push(siteId);
    }
  });

  it('Create a new empty site', () => {
    navigateToSiteCreatePage(cy);

    //fill in form
    fillInForm([...getDefaultSiteFields(), ...createEmptySiteFields], cy);

    submitForm(cy);

    checkIfSiteCreationIsSuccesfull(cy);

    // should expect correct redirect to new site
    const siteId = checkIfSiteCreationIsSuccesfull();

    if (siteId) {
      createdSites.push(siteId);
    }
  });

  it('Import a new empty site', () => {
    cy.visit(Cypress.env('adminUrl'));

    // go to voting page
    cy.get('.btn').contains('import');
      .click();

    fillInForm([...getDefaultSiteFields(), ...importSiteFields], cy);

    submitForm(cy);

    checkIfSiteCreationIsSuccesfull(cy);

    // should expect correct redirect to new site
    const siteId = checkIfSiteCreationIsSuccesfull();

    if (siteId) {
      createdSites.push(siteId);
    }
  });

  it('Edit basic auth of first created site', () => {
    // assume first site exists
    const editUrl = Cypress.env('adminUrl') + '/admin/site/' + createdSites[0];
    cy.visit(editUrl);

    const newUser = 'user-' + new DateTime();
    const newPassword = 'pw-' + new DateTime();

    fillInField('basicAuthUser', 'text', newUser, cy);
    fillInField('basicAuthPassword', 'text', newPassword, cy);

    submitForm(cy);

    //input should be changed
    cy.get('[name=basicAuthUser]').

    // get the site url
    const siteUrl = cy.get('[name=productionUrl]')
      .first()
      .value()

    // visit site, throws error if basic auth is false
    cy.visit(siteUrl, {
      auth: {
        username: newUser,
        password: newPassword
      }
    });
  });


  it('Delete created sites', () => {
    // delete created site to clean up and test at the same time
    createdSites.forEach((site, i) => {
      const deleteUrl = Cypress.env('adminUrl') + '/admin/site/' + site.id;
      cy.visit(deleteUrl);

      cy.get('.btn')
        .contains('verwijder')
        click();

      // same ure should now give a 404
      cy.visit(deleteUrl);
    });
  })


})
