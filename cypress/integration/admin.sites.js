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
            cy.log('visit site, throws error if basic auth is false');

            const options = basicAuthUser && basicAuthPassword ? {
                auth: {
                    username: basicAuthUser,
                    password: basicAuthPassword
                }
            } : {}

            cy.visit(siteUrl, options);

        })
}

const deleteSite = (cy, siteId) => {
    const settingsUrl = Cypress.env('adminUrl') + '/admin/site/' + siteId + '/settings';
    cy.visit(settingsUrl);

    cy.log('Delete site ');

    cy.wait(200)

    cy.get('button')
        .contains('Verwijder')
        .click();

    cy.log('Finito');
}

// A large test, but contains basic crud of a site
describe('Filling, validating, submitting, editing, deleting a site', () => {
    it('Copy a site', () => {
        cy.loginAdminPanel();

        cy.log('Go to copy page');

        // go to voting page
        cy.contains('Kopieer site')
            .click();

        cy.wait(200);

        cy.log('Copy a site');

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

                deleteSite(cy, siteId)
            });

    });

    it('Create budgetting site and visit it, then delete it', () => {
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

                cy.log('Site ID found', siteId);

                const newUser = 'user-' + new Date().getTime();
                const newPassword = 'pw-' + new Date().getTime();

                setBasicAuthPassword(cy, siteId, newUser, newPassword);

                findUrlAndVisit(cy, siteId, newUser, newPassword);

                deleteSite(cy, siteId)
            });
    });

    it('Create ideas submit site and visit it, then delete it', () => {
        cy.loginAdminPanel();

        // go to voting page
        cy.get('.btn')
            .contains('Maak nieuwe site')
            .click();

        fillInForm([...getDefaultSiteFields()], cy);

        cy.contains('Plannen insturen')
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

                setBasicAuthPassword(cy, siteId, newUser, newPassword);

                findUrlAndVisit(cy, siteId, newUser, newPassword);

                deleteSite(cy, siteId)
            });
    });

    it('Create empty site and visit it, then delete it', () => {
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

                const newUser = 'user-' + new Date().getTime();
                const newPassword = 'pw-' + new Date().getTime();

                setBasicAuthPassword(cy, siteId, newUser, newPassword);

                findUrlAndVisit(cy, siteId, newUser, newPassword);

                deleteSite(cy, siteId)
            });
    });

    it('Create a voting site and visit it, then delete it', () => {
        cy.loginAdminPanel();

        // go to voting page
        cy.get('.btn')
            .contains('Maak nieuwe site')
            .click();

        fillInForm([...getDefaultSiteFields()], cy);

        cy.contains('Stemsite')
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

                setBasicAuthPassword(cy, siteId, newUser, newPassword);

                findUrlAndVisit(cy, siteId, newUser, newPassword);

                deleteSite(cy, siteId)
            });
    });

})
