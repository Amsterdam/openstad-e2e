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
    cy.get('.tile-list .list-item')
      .its('length')
      .should('be.gte', 1);

    // check if image is present
    cy.get('.tile-list .list-item .image')
      .its('length')
      .should('be.gte', 1);
  });


  it('Filter on theme & area', () => {

    cy.selectNth('select[name="theme"]', 0)
      .invoke('val')
      .then(selectedTheme => {
        cy.log('Selected theme: ', selectedTheme);

        cy.reload()

          //@todo add data-area
        cy.get('.tile-list .list-item')
          .its('length').then((itemCount) => {
            cy.get(`.tile-list .list-item[data-theme="${selectedTheme}"]`)
            .its('length')
            .should('be.eq', itemCount)
          });
      });

      // Select first area
      cy.selectNth('select[name="area"]', 0)
          .invoke('val')
          .then(selectedArea => {
              cy.log('Selected area: ', selectedArea);

              cy.reload()

              //@todo add data-area
              cy.get('.tile-list .list-item')
                  .its('length').then((itemCount) => {
                  cy.get(`.tile-list .list-item[data-area="${selectedArea}"]`)
                      .its('length')
                      .should('be.eq', itemCount)
              });
          });
  });
})
