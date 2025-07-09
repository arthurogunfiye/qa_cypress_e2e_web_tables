/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Web Tables page', () => {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 65 }),
    salary: faker.number.int({ min: 30000, max: 150000 }),
    department: faker.commerce.department()
  };

  beforeEach(() => {
    cy.visit('https://demoqa.com/webtables');
    cy.get('h1.text-center').should('be.visible').and('contain', 'Web Tables');
    cy.get('.web-tables-wrapper .ReactTable').should('be.visible');
  });

  it('table should have pagination', () => {
    cy.get('.pagination-bottom > .-pagination').should('be.visible');
  });

  it('table should have rows count selection', () => {
    cy.get('.-pageSizeOptions > [aria-label="rows per page"]').should(
      'be.visible'
    );
    cy.get('.-pageSizeOptions > [aria-label="rows per page"]')
      .find('option')
      .should('have.length.greaterThan', 0);
  });

  it('user should be able to add a new worker', () => {
    cy.get('#addNewRecordButton').should('be.visible').click();

    cy.get('.modal-content').should('be.visible');
    cy.get('#firstName').type(user.firstName);
    cy.get('#lastName').type(user.lastName);
    cy.get('#userEmail').type(user.email);
    cy.get('#age').type(user.age.toString());
    cy.get('#salary').type(user.salary.toString());
    cy.get('#department').type(user.department);
    cy.get('#submit').click();

    cy.get('[role="rowgroup"]')
      .eq(3)
      .find('[role="gridcell"]:first')
      .should('contain', `${user.firstName}`);
  });

  it('user should be able to delete a worker', () => {
    cy.get('#delete-record-1').should('be.visible').click();
    cy.get('[role="rowgroup"]')
      .first()
      .get('[role="gridcell"]')
      .eq(3)
      .should('not.contain', 'cierra@example.com');
  });

  it('user should be able to delete all workers', () => {
    const numberOfRows = Cypress.$('[role="rowgroup"]').find(
      'span[title="Delete"]'
    ).length;

    for (let i = 1; i < numberOfRows + 1; i++) {
      cy.get(`#delete-record-${i}`).should('be.visible').click();
    }
  });

  it('user should be able to edit a worker', () => {
    cy.get('#searchBox').should('be.visible').type('Cierra');

    cy.get('span[title="Edit"]').should('be.visible').click();

    cy.get('.modal-content').should('be.visible');

    cy.get('#age').clear();
    cy.get('#age').type('30');
    cy.get('#salary').clear();
    cy.get('#salary').type('57500');
    cy.get('#submit').click();

    cy.get('[role="rowgroup"]')
      .eq(0)
      .find('[role="gridcell"]')
      .eq(2)
      .should('contain', '30');
    cy.get('[role="rowgroup"]')
      .eq(0)
      .find('[role="gridcell"]')
      .eq(4)
      .should('contain', '57500');
  });
});
