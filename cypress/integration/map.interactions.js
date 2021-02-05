/**
 * Testing default overview of submitted plans
 * @Todo many details: combined selections, tags, exclude/include, second areas, progressbar, status
 */

const { WaitForControllerApiFactory } = require("mailslurp-client")

const randomClickCoordinate = () => {
    return Math.random() * 300
}

const timestamp = Date.now()

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    console.log('Error ', err)
    return false;
})

const formFields = [
    {
        title: 'Titel',
        element: 'input',
        invalidInput: 'abc',
        validInput: `${timestamp} titel die lang genoeg is`,
        expectedFormWarning: 'De tekst is te kort'
    },
    {
        title: 'Samenvatting',
        element: 'textarea',
        invalidInput: 'abc',
        validInput: 'Ik ben een samenvatting die lang genoeg is',
        expectedFormWarning: 'De tekst is te kort'
    },
    {
        title: 'Beschrijving',
        element: 'textarea',
        invalidInput: 'abc',
        validInput: 'Helvetica authentic keytar, blog photo booth gochujang pour-over sartorial. Cardigan pitchfork cold-pressed, raw denim green juice hella live-edge',
        expectedFormWarning: 'De tekst is te kort'
    }
]

describe('Log in and add idea', () => {

    it('Map should show', () => {
        // goto site
        cy.visit(`${Cypress.env('mapSiteUrl')}/kaart`, {
            auth: {
                username: Cypress.env('adminBasicAuthUser'),
                password: Cypress.env('adminBasicAuthPass')
            }
        })

        //   check entire map is shown
        cy.get('.openstad-component-ideas-on-map').should('be.visible')
        //   check map-part (right) is shown
        cy.get('.osc-ideas-on-map-info').should('be.visible')
        //   check list-part (left) is shown
        cy.get('.osc-ideas-on-map-map').should('be.visible')

    });

    it('Clicking map shows marker', () => {
        cy.get('.leaflet-container').click()
        cy.get('.leaflet-marker-icon').should('be.visible')
    })

    it('Log in using button at top of listview', () => {
        // Accept cookies
        cy.get('.cookie-button-blue').click()
        cy.get('.leaflet-container').click(randomClickCoordinate(), randomClickCoordinate())
        cy.get('.osc-not-logged-in-button').click()
        cy.contains('Inlog via Wachtwoord').click()
        cy.get('#name').type(Cypress.env('defaultUserEmail'))
        cy.get('#password').type(Cypress.env('userPassword'))
        cy.get('button').contains('Inloggen').click()
    })

    it('Add idea using integrated form', () => {
        cy.get('.leaflet-container').click(randomClickCoordinate(), randomClickCoordinate())
        cy.contains('Nieuw punt toevoegen').click()
        cy.get('.osc-form-fields')
        formFields.forEach((field, i) => {
            cy.get('.osc-form-feedback').eq(i).within(() => {
                cy.get(field.element).type(field.invalidInput)
            })
        })
        cy.contains('Versturen').click()
        cy.get('.osc-form-errors-warning').scrollIntoView().should('be.visible')
        formFields.forEach((field, i) => {
            cy.get('.osc-form-feedback').eq(i).within(() => {
                cy.get(field.element).clear().type(field.validInput)
            })
        })
        cy.contains('Versturen').click()
    })

    it('Newly added idea is selected and can be opened', () => {
        cy.get('.osc-info-block-selected-idea').within(() => {
            cy.get('h4').should('contain', formFields[0].validInput)
            cy.wait(200)
            cy.get('.osc-info-block-selected-idea-idea').click()
        })
        cy.get('.osc-idea-details > h2').should('contain', formFields[0].validInput)
    })
})

describe('Idea can be liked', () => {
    it('Login in and accept cookies', () => {
        cy.visit(`${Cypress.env('mapSiteUrl')}/kaart`, {
            auth: {
                username: Cypress.env('adminBasicAuthUser'),
                password: Cypress.env('adminBasicAuthPass')
            }
        })
        cy.get('a.account').click()
        cy.loginUserWithPassword(Cypress.env("defaultUserEmail"), Cypress.env("userPassword"));
        cy.get('.cookie-button-blue').click()
        cy.contains('Kaart').click()
    })

    it('Open idea details', () => {
        cy.get('.osc-info-block-ideas-list-idea').first().click()
    })

    it('Like idea with logged in user', () => {
        cy.get('#likebutton-number-plate-0').then(($numberPlate) => {
            const startValue = parseInt($numberPlate.text())
            cy.log(`startValue: ${startValue}`)
            cy.contains('eens').click()
            cy.wait(200)
            cy.get('#likebutton-number-plate-0').should('contain', (startValue+1))
        })
    })
})