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
    validInput: 'I am a title of an idea'
  },
  {
    title: 'Title',
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
    type: 'text',
    // empty input should give an error
    invalidInput: '',
    validInput: 'Groen en Duurzaam'
  },
  {
    name: 'extraData[area]',
    type: 'text',
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
  const fieldRef = cy.get(`[name="${name}"]`);

  if (type === 'js-editor') {
    cy.get(`#js-editor`).type(value)
  } else if (type === 'text' && value) {
    fieldRef.type(value)
  } else if (type === 'select' || 'checkbox') {
    cy.selectNth('select[name="'+name+'"]', 1)

  //  fieldRef.select(value)
  }
}

// A large test, but contains all editing,
// Then cleans up after itself
describe('Filling, validating, submitting, editing, deleting a ideas', () => {

  it('Submit an idea', () => {

    cy.wait(1000);

    cy.visit(Cypress.env('submittingSiteUrl'));

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

    cy.wait(500)

    // add location click
    // @todo add more interaction tests
    cy.get('#map')
      .click();

    cy.wait(500)

    cy.get('.resource-form [type="submit"]')
      .click()
  });

})
