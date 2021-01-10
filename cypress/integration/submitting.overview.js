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

    cy.selectNth('select[name="theme"]', 0)
      .invoke('val')
      .then(selectedTheme => {
        cy.log('Selected theme: ', selectedTheme);

        //@todo add data-area
        cy.get('.tile-list .list-item')
          .its('length', (itemCount) => {
            cy.get(`.tile-list .list-item [data-theme="${selectedTheme}"]`)
            .its('length')
            .should('be.eq', itemCount)
          });
      });

      cy.wait(2000)


    // reset theme selection
    cy.get('select[name="theme"]')
      .select('')
  });

  it('Filter on area', () => {
    // Select first area
    cy.selectNth('select[name="area"]', 0)
      .invoke('val')
      .then(selectedArea => {
        cy.log('Selected area: ', selectedArea);

        //@todo add data-area
        cy.get('.tile-list .list-item')
          .its('length', (itemCount) => {
            cy.get(`.tile-list .list-item data-area=["${selectedArea}"]`)
            .its('length')
            .should('be.eq', itemCount)
          });
      });

    // reset area selection
    cy.get('select[name="area"]')
      .invoke('val', '')
  });

})
