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

const templatesToTest = [
    'Participatief begroten',
    'Plannen insturen',
    'Stemsite',
    'Lege site',
];

const importSiteFields = []

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

const checkIfSiteCreationIsSuccessful = (cy) => {
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
    cy.visit(editUrl);

    fillInField('config[basicAuth][user]', newUser, 'text', cy);
    fillInField('config[basicAuth][password]', newPassword, 'text', cy);

    submitForm(cy);
}

const findUrlAndVisit = (cy, siteId, basicAuthUser, basicAuthPassword) => {
    //input should be changed
    cy.visit(Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings');

    // get the site url
    cy.get('[name=productionUrl]')
        .first()
        .invoke('val')
        .then((siteUrl) => {
            // visit site, throws error if basic auth is false
            cy.log('siteUrl found', siteUrl)
            cy.log('visit site, throws error if basic auth is false');

            const options = basicAuthUser && basicAuthPassword ? {
                auth: {
                    username: basicAuthUser,
                    password: basicAuthPassword
                }
            } : {}

            cy.wait(10000);

            cy.visit(siteUrl, options);

        })
}

const deleteSite = (cy, siteId, disableProjectEnded = false) => {
    const settingsUrl = Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings';
    const reactSettingsUrl = Cypress.env('adminUrl') + '/admin/site/' + siteId + '/beta';

    if (!disableProjectEnded) {
        cy.log(`Set 'Project has ended' true`)
        cy.visit(reactSettingsUrl);
        cy.contains('Site settings').click();
        cy.contains('Project has ended').parent().click();
        cy.contains('Save').click();
        cy.contains('Element updated', { timeout: 10000 }).should('be.visible');
    }

    cy.log(`Delete website`)
    cy.visit(settingsUrl);
    cy.wait(200)

    cy.get('button')
        .contains('Website verwijderen')
        .click();

    disableProjectEnded ?
        cy.contains('Er gaat iets mis: Cannot delete an active site - first set the project-has-ended parameter', { timeout: 10000 }).should('be.visible') :
        cy.contains('Verwijderd!', { timeout: 10000 }).should('be.visible')
    
    cy.log('Finito');
}

const createVisitDeleteSite = (templateName) => {
    cy.loginAdminPanel();

    // go to voting page
    cy.get('.btn')
        .contains('Maak nieuwe site')
        .click();
    
    cy.contains('Sub domain')
        .first()
        .click();

    fillInForm([...getDefaultSiteFields()], cy);

    cy.contains(templateName)
        .first()
        .click();

    submitForm(cy);

    cy.url()
        .then(url => {
            cy.log('url', url);
            siteId = url.substring(url.lastIndexOf('/') + 1);

            cy.log('Site ID found', siteId);

            const newUser = 'user-' + new Date().getTime();
            const newPassword = 'pw-' + new Date().getTime();

            cy.wait(5000);

            setBasicAuthPassword(cy, siteId, newUser, newPassword);

            findUrlAndVisit(cy, siteId, newUser, newPassword);

            deleteSite(cy, siteId)
        });
}

// A large test, but contains basic crud of a site
describe('Filling, validating, submitting, editing, deleting a site', () => {

    // Copy a site

    it('Copy a site', () => {
        cy.loginAdminPanel();

        cy.log('Go to copy page');

        // go to voting page
        cy.contains('Kopieer site')
            .click();

        cy.wait(200);

        cy.log('Copy a site');

        cy.contains('Sub domain')
            .first()
            .click();

        fillInForm([...getDefaultSiteFields(), ...copySiteFields], cy)

        submitForm(cy);

        cy.url()
            .then(url => {
                cy.log('url', url);
                siteId = url.substring(url.lastIndexOf('/') + 1);

                cy.log('Site ID found', siteId);

                const newUser = 'user-' + new Date().getTime();
                const newPassword = 'pw-' + new Date().getTime();

                setBasicAuthPassword(cy, siteId, newUser, newPassword);

                findUrlAndVisit(cy, siteId, newUser, newPassword);

                // First check that the site cannot be deleted without setting 'Project has ended' setting
                deleteSite(cy, siteId, true)

                // Delete site
                deleteSite(cy, siteId)
            });

    });

    // Create new site from each template

    templatesToTest.forEach((templateName) => {
        it(`Create a ${templateName} template site and visit it, then delete it`, () => {
            createVisitDeleteSite(templateName);    
        })
    })

})
