Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Anonymous liking', () => {

  it('Ga naar plan en klik op like', () => {
    // goto site
    cy.visit(Cypress.env('submittingSiteUrl'))

    // goto plannen
    cy.contains('Plannen')
      .click()

    // click on the first plan
    cy.get('.tile.idea-item.list-item')
      .first()
      .click()

    // click on like button
    cy.get('.role-required-anonymous.idea-status-OPEN.ajax-form')
      .first()
      .click()

    // oauth postcode
    cy.get('input.input-field')
      .type('1011 HB')

    // oauth submit
    cy.get('.btn.btn-primary')
      .click()

    // check button
    // @todo, change color to selected class
    cy.get('.role-required-anonymous.idea-status-OPEN.ajax-form')
      .should('have.css', 'background-color', 'rgb(189, 209, 49)');

  })
})
