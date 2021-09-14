/**
 * Testing default overview of submitted plans
 * @Todo many details: combined selections, tags, exclude/include, second areas, progressbar, status
 */

const { WaitForControllerApiFactory } = require("mailslurp-client")

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    console.log('Error ', err)
    return false;
})

const timestamp = Date.now()

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
        validInput: `${timestamp} ${timestamp} ${timestamp} ${timestamp} gochujang pour-over sartorial. Cardigan pitchfork cold-pressed, raw denim green juice hella live-edge`,
        expectedFormWarning: 'De tekst is te kort'
    }
]

const argument = {
    invalidInput: 'Te kort',
    validInput: `${timestamp} blog photo booth gochujang pour-over sartorial.`
}

const randomClickCoordinate = () => {
    return Math.random() * 300
}

const addOrRemoveLike = () => {
    cy.get('#likebutton-number-plate-0').then(($numberPlate) => {

        const startValue = parseInt($numberPlate.text())

        cy.get('.likebutton-name').then(($likeButton) => { 
            cy.log(`Amount of likes before clicking button: ${startValue}`)
            cy.contains('eens').click()
            cy.wait(200)
            cy.get('#likebutton-number-plate-0').should('not.contain', (startValue))
        })
    })
}

describe('Log in and add idea', () => {

    it('Map should show, with clicking a marker', () => {
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
        cy.wait(1000)
        cy.contains('Nieuw punt toevoegen').click()
        cy.get('.osc-form-fields')
        formFields.forEach((field, i) => {
            cy.get('.osc-form-feedback').eq(i).within(() => {
                cy.get(field.element).type(field.invalidInput)
            })
        })
        cy.uploadFile("input[type=file]", "image-for-upload.jpeg", "image/jpeg")
        cy.wait(6000)
        cy.contains('Versturen').click()
        cy.get('.osc-form-errors-warning').scrollIntoView().should('be.visible')
        formFields.forEach((field, i) => {
            cy.get('.osc-form-feedback').eq(i).within(() => {
                cy.get(field.element).clear().type(field.validInput)
            })
        })
        cy.contains('Versturen').click()

        cy.get('.osc-idea-details > h2').should('contain', formFields[0].validInput)
    })
})

describe('Like and comment idea', () => {
    it('Add and remove like with logged in user', () => {
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

        cy.get('.osc-idea-tile').first().click()



        let count = 0;
        while (count < 3) {
            addOrRemoveLike()
            count++
            cy.wait(1000)
        }
    })

    it('Place argument', () => {
        cy.get('.osc-form-feedback > textarea').type(argument.invalidInput)
        cy.contains('Verzenden').click()
        cy.get('.osc-form-warning').should('contain', 'De tekst is te kort')
        cy.get('.osc-form-feedback > textarea').clear().type(argument.validInput)
        cy.contains('Verzenden').click()
        cy.get('.osc-reaction-description').should('contain', argument.validInput)
    })
})

describe('Remove idea', () => {
    it('Remove idea with moderator user', () => {
        cy.visit(`${Cypress.env('mapSiteUrl')}/kaart`, {
            auth: {
                username: Cypress.env('adminBasicAuthUser'),
                password: Cypress.env('adminBasicAuthPass')
            }
        })
        cy.get('a.account').click()

        cy.loginUserWithPassword(Cypress.env("moderatorUserEmail"), Cypress.env("moderatorPassword"));

        cy.get('.cookie-button-blue').click()

        cy.visit(`${Cypress.env('mapSiteUrl')}/admin`)
        cy.contains('Plannen').click()
        cy.get('[type="checkbox"]').first().check()
        cy.contains('Delete').click()
        cy.contains('Confirm').click()
        cy.wait(2000)
    })
})
