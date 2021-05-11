Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

const formFields = [
  {
    title: 'Title',
    name: 'title',
    type: 'text',
    invalidInput: 'Too short',
    validInput: 'I am a title of an idea',
    checkIfTextOnPage: true
  },
  {
    title: 'Summary',
    name: 'summary',
    type: 'text',
    invalidInput: 'Too short',
    validInput: 'I am a summary of an idea'
  },
  {
    name: 'description',
    type: 'js-editor',
    // don't validate for now
    invalidInput: null,
    validInput: 'This should be the correct length of a description, fully, without joking, and other things, I\'m fully 100% correct and long enough so that the website allows me to submit an idea.'
  },
  {
    name: 'extraData[theme]',
    type: 'select',
    // empty input should give an error
    invalidInput: '',
    validInput: 'Groen en Duurzaam'
  },
  {
    name: 'extraData[area]',
    type: 'select',
    // empty input should give an error
    invalidInput: '',
    validInput: 'Buurt 1'
  },
  {
    name: 'extraData[phone]',
    type: 'text',
    invalidInput: '06',
    validInput: '0612341234'
  },
];

const fillInField = (name, value, type, cy) => {
  if (type === 'js-editor') {
    cy.get(`#js-editor`).clear().type(value)
  } else if (type === 'text' && value) {
    cy.get(`[name="${name}"]`).clear().type(value)
  } else if (type === 'select' || 'checkbox') {
    cy.selectNth('select[name="'+name+'"]', 1)
  }
}

//currenlty only works for text fields
const textIsVisibleOnPage = (content, cy) => {
  cy.contains(content)
    .its('length')
    .should('be.gte', 0)
}

// A large test, but contains all editing,
// Then cleans up after itself
describe('Filling, validating, submitting, editing, deleting a ideas', () => {

  it('Submit an idea', () => {

    // goto site
    cy.visit(`${Cypress.env('submittingSiteUrl')}`, {
      auth: {
          username: Cypress.env('adminBasicAuthUser'),
          password: Cypress.env('adminBasicAuthPass')
      }
    })

    // go to first page
    cy.get('.menu-cta-button')
      .first()
      .click();

    // go to form page
    cy.get('.next-button')
      .first()
      .click();

    cy.get('h1')
      .contains('Login')
      .its('length')
      .should('eq', 1);

      // go to first page
    cy.get('.filled-button')
      .contains('Inloggen')
      .first()
      .click();

    cy.loginUserWithPassword(Cypress.env("defaultUserEmail"), Cypress.env("userPassword"));

    cy.get('.cookie-button')
      .first()
      .click({
        force: true
      });

/*
    // go to first page
    cy.get('.menu-cta-button')
      .first()
      .click();

    // go to form page
    cy.get('.next-button')
      .first()
      .click();
*/

    cy.uploadFile("input[type=file]", "image-for-upload.jpeg", "image/jpeg")

    cy.wait(3000)

    // test validation
    formFields.forEach((field, i) => {
      // go to first page
      if (field.invalidInput !== null) {
        fillInField(field.name, field.invalidInput, field.type, cy);
      }
    });

    cy.get('.resource-form [type="submit"]')
      .click()

    formFields.forEach((field, i) => {
      // go to first page
      if (field.invalidInput) {
        // in most cases next is label with error
        // in some special cases, mainly checkbox it's different
        // @todo add these later
        cy.get(`[name="${field.name}"]`)
          .siblings('label.error')
          .its('length')
          .should('eq', 1)
      }
    });


    /**
     * Test interactions and uploading of image
     cy.get(fileUploader).trigger('dragenter');
     cy.dropFile(imagePath);
    */

    /**
     * Fill in listed fields with correct values
     */
    formFields.forEach((field, i) => {
      // go to first page
      fillInField(field.name,  field.validInput, field.type, cy);
    });

    cy.wait(200)

    // add location click
    // @todo add more interaction tests
    cy.get('#nlmaps-holder')
      .click();

    cy.wait(200)

    cy.get('.resource-form [type="submit"]')
      .click()

    /**
     * Fill in listed fields with correct values
     */
    formFields.forEach((field, i) => {
      // go to first page
      if (field.checkIfTextOnPage) {
        textIsVisibleOnPage(field.validInput, cy);
      }
    });

    // go to edit form
    cy.get('button')
      .contains('Bewerk')
      .click()

    /**
     * Fill in listed fields with edit values
     */
     formFields.forEach((field, i) => {
       fillInField(field.name,  'Edit ' + field.validInput, field.type, cy);
     });

    cy.get('.resource-form [type="submit"]')
      .click();

    /**
     * See if edit was succesfull
     */
    formFields.forEach((field, i) => {
      // go to first page
      if (field.checkIfTextOnPage) {
        textIsVisibleOnPage('Edit ' + field.validInput, cy);
      }
    });

    cy.wait(500);
    cy.intercept('api/*').as('apiCall')

    // like the plan
    cy.get('#idea-vote-form-yes [type="submit"]')
      .first()
      .click();

  //  cy.wait('@apiCall');

    cy.reload();

    cy.wait(1000);

    cy.get('.edit').should('not.exist');

    // unlike the plan
    cy.get('#idea-vote-form-yes [type="submit"]')
      .first()
      .click();

//cy.wait('@apiCall');
    cy.reload();


    // dislike the plan
    cy.get('#idea-vote-form-no [type="submit"]')
      .first()
      .click();

    cy.scrollTo('top')
    cy.reload();

    // like the plan
    cy.get('#idea-vote-form-no [type="submit"]')
      .first()
      .click();

    cy.reload();

    cy.get('#idea-vote-form-yes [type="submit"]')
    .first()
    .click();

    //cy.wait('@apiCall');
    cy.reload();

    // unlike the plan
    cy.get('#idea-vote-form-yes [type="submit"]')
    .first()
    .click();

    cy.reload();

    // the edit button should be visible again,
    cy.get('.edit').its('length').should('eq', 1)

    // the edit button should be visible again,
    cy.get('button')
      .contains('Verwijder')
      .click();
  });

})
