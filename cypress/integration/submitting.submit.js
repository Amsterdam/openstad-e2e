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
    validInput: 'This is the correct length'
  },
  {
    title: 'Title',
    name: 'summary',
    type: 'text',
    invalidInput: 'Too short',
    validInput: 'This is the correct length'
  },
  {
    name: 'description',
    type: 'text',
    invalidInput: 'Too short',
    validInput: 'This is the correct length'
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

  /**
   * Generic test listed fields
   */
  formFields.forEach((field, i) => {
    it('Can fill in ' + field.title, () => {
      // go to first page
      fillInField(field.name,  field.validInput, field.type, cy);
    });
  });

  /**
   * Test interactions and uploading of image
   */
  it('Can upload image by clicking', () => {
    // go to first page

  });

  it('Can remove image by clicking', () => {
    // go to first page

  });

  it('Can upload image by dragging', () => {
    // go to first page

  });

  it('Can remove image again', () => {
    // go to first page
  });

  it('Can upload a bigger image of 5mb', () => {
    // go to first pag
  });

  // test validation
  formFields.forEach((field, i) => {
    it('Valdidation should give error for ' + field.title, () => {
      // go to first page
      fillInField(field.name, field.type, field.value);
    });
  });

  // test validation
  formFields.forEach((field, i) => {
    it('Valdidation should give error for ' + field.title, () => {
      // go to first page
      fillInField(field.name, field.type, field.value);
    });
  });

  it('Can submit idea', () => {
    // fill in correct fields
    formFields.forEach((field, i) => {

    });

    // expect to go to new page
  });

  formFields.forEach((field, i) => {
    it('Field '+ field.title +' is visible on idea page' , () => {

    })
  });

  it('Image is visible on idea page', () => {
    // go to first page
  });


})
