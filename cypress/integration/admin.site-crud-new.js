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
    validInput: 'Test Site ' + new Date().getTime()
  },
  {
    name: 'domain',
    type: 'text',
    validInput: 'test-site-' + new Date().getTime()
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
    // plannen insturen site
    validInput: 221
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
  cy.get('.btn').contains('Maak nieuwe site aan')
    .click();
}

// A large test, but contains basic crud of a site
describe('Filling, validating, submitting, editing, deleting a site', () => {
  it('Login succesfull', () => {
    cy.loginAdminPanel();

  //  cy.get('.section-header')
    //  .should('have.text', 'Sites');

    cy.log('Go to copy page');

    cy.wait(1000);

    // go to voting page
    cy.contains('Kopieer site')
      .click();

    cy.wait(3000);

    cy.log('Copy a site');

    fillInForm([...getDefaultSiteFields(), ...copySiteFields], cy)

    submitForm(cy);

  });

  //it('Copy a site 2', () => {
    // visit
//  cy.visit(Cypress.env('adminUrl') + '/admin');

  //  cy.log('Go to copy page');

    // go to voting page
//    cy.contains('Kopieer site')
  //    .click();

  /*  fillInForm([...getDefaultSiteFields(), ...copySiteFields], cy);

    // should expect correct redirect to new site
    submitForm(cy);

    checkIfSiteCreationIsSuccesfull(cy);

    // should expect correct redirect to new site
    const siteId = checkIfSiteCreationIsSuccesfull();

    if (siteId) {
      createdSites.push(siteId);
    }*/
  });
/*
  it('Create a new budgetting site', () => {
    navigateToSiteCreatePage(cy)

    fillInForm(getDefaultSiteFields(), cy);

    cy.contains('Participatief begroten')
      .click();

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
    fillInForm(getDefaultSiteFields(), cy);

    cy.contains('Plannen insturen')
      .click();

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
    fillInForm(getDefaultSiteFields(), cy);

    cy.contains('Stemsite')
      .click();

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
    fillInForm(getDefaultSiteFields(), cy);

    cy.contains('Lege site')
      .click();

    submitForm(cy);

    checkIfSiteCreationIsSuccesfull(cy);

    // should expect correct redirect to new site
    const siteId = checkIfSiteCreationIsSuccesfull();

    if (siteId) {
      createdSites.push(siteId);
    }
  });

/*
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

    const newUser = 'user-' + new Date();
    const newPassword = 'pw-' + new Date();

    fillInField('basicAuthUser', 'text', newUser, cy);
    fillInField('basicAuthPassword', 'text', newPassword, cy);

    submitForm(cy);

    //input should be changed
    cy.get('[name=basicAuthUser]').

    // get the site url
    cy.get('[name=productionUrl]')
      .first()
      .invoke('val')
      .then((siteUrl) => {
        // visit site, throws error if basic auth is false
        cy.visit(siteUrl, {
          auth: {
            username: newUser,
            password: newPassword
          }
        });
      })

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
  */

})
