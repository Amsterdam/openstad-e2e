/**
 * Testing default overview of submitted plans
 * @Todo many details: combined selections, tags, exclude/include, second areas, progressbar, status
 */
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    console.log('Error ', err)
    return false;
  })
  
  describe('Interactive map interactions', () => {
  
    it('Map should show', () => {
      // goto site
      cy.visit(Cypress.env('mapSiteUrl'), {
        auth: {
          username: Cypress.env('adminBasicAuthUser'),
          password: Cypress.env('adminBasicAuthPass')
        }
      })
  
    });
  
  
  
  })
  