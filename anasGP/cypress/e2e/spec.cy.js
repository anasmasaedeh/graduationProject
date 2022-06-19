describe('Testing', () => {
  it('should visit the site', () => {
    cy.visit('localhost:3000')
  })

  it('should able to open sign in page', () => {
    cy.get('.btn.btn-outline-secondary').click()
  })

  it('should be able to register an user', () => {
    cy.get("[name=username").type("test@test.com")
    cy.get("[name=ministryNumber").type("99999999")
    cy.get("[name=password").type("123456")
    cy.get("[name=register-button").click()
  })
})