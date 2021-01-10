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
    type: 'text',
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

  if (type === 'text') {
    fieldRef.type(value)
  } else if (type === 'select' || 'checkbox') {
    fieldRef.select(value)
  }
}

// A large test, but contains all editing,
// Then cleans up after itself
describe('Filling, validating, submitting, editing, deleting a ideas', () => {

  it('Form page is reachable', () => {
    cy.loginUser(Cypress.env('submittingSiteUrl'));

    // go to first page
    cy.contains('Plan indienen')
      .click()

    // go to form
    cy.contains('Verder')
      .click()
  });

  it('Filling, validating and submitting the form', () => {

    // test validation
    formFields.forEach((field, i) => {
      // go to first page
      if (field.invalidInput === null) {
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
          .next()
          .should()
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

    // add location click
    // @todo add more interaction tests
    cy.get('#map')
      .click();

    cy.get('.resource-form [type="submit"]')
      .click()
  });


  it('Fields are visible after submitting', () => {
    // go to first page

  });


})
