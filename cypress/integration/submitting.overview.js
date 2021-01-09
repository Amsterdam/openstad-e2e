Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Error ', err)
  return false;
})

describe('Submitting rendering ideas', () => {

  it('Overview should have more then one submitted idea', () => {
    // goto site
    cy.visit(Cypress.env('submittingSiteUrl'))

    // go to voting page
    cy.get('.nav-link').contains('Plannen')
      .click()

    // check if more then one list item is found
    cy.get('.tile.idea-item.list-item')
      .its('length')
      .should('be.gte', 1)
  });

  it('Sorting on created date', () => {

  });

  it('Filter on theme', () => {
    // Select first theme
    // Filter is triggerd on change so not necessary to submit a form
    cy.get('select[name="theme"] options')
      .eq(1)
      .select()
      .invoke('val')
      .then(selectedArea => {
        const selectedArea = selectedArea;
        cy.log('Selected area: ', selectedArea);
      });

    // reset theme selection
    cy.get('select[name="theme"] options')
      .invoke('val', '')
  });

  it('Filter on area', () => {

    // Select first area
    cy.get('select[name="area"] options')
      .eq(1)
      .select()
      .invoke('val')
      .then(selectedArea => {
        const selectedArea = selectedArea;
        cy.log('Selected area: ', selectedArea);

      });

    // reset area selection
    cy.get('select[name="theme"] options')
      .invoke('val', '')
  });

})
