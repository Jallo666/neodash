import { barChartCypherQuery } from '../fixtures/cypher_queries';

const WAITING_TIME = 20000;
// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('Testing table', () => {
  beforeEach('open neodash', () => {
    cy.viewport(1920, 1080);
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get('#form-dialog-title', { timeout: 20000 }).should('contain', 'NeoDash - Neo4j Dashboard Builder').click();

    cy.get('#form-dialog-title').then(($div) => {
      const text = $div.text();
      if (text == 'NeoDash - Neo4j Dashboard Builder') {
        cy.wait(500);
        // Create new dashboard
        cy.contains('New Dashboard').click();
      }
    });

    cy.get('#form-dialog-title', { timeout: 20000 }).should('contain', 'Connect to Neo4j');

    cy.get('#url').clear().type('localhost');
    cy.get('#dbusername').clear().type('neo4j');
    cy.get('#dbpassword').type('test1234');
    cy.get('button').contains('Connect').click();
    cy.wait(100);

    //Opens the div containing all report cards
    cy.get('.react-grid-layout:eq(0)').within(() => {
      //Finds the 2nd card
      cy.get('.MuiGrid-root')
        .eq(1)
        .within(() => {
          //Clicks the 2nd button (opens settings)
          cy.get('button').eq(1).click();
        });
    });
    cy.get('.react-grid-layout:eq(0)').within(() => {
      //Finds the 2nd card
      cy.get('.MuiGrid-root')
        .eq(1)
        .within(() => {
          //Opens the drop down
          cy.getDataTest('type-dropdown').click();
        });
    });
    // Selects the Table option
    cy.get('[id^="react-select-5-option"]')
      .contains(/Bar Chart/i)
      .should('be.visible')
      .click({ force: true });
    cy.get('.react-grid-layout .MuiGrid-root:eq(1) #type input[name="Type"]').should('have.value', 'Bar Chart');

    // Creates basic bar chart
    cy.get('.react-grid-layout')
      .first()
      .within(() => {
        //Finds the 2nd card
        cy.get('.MuiGrid-root')
          .eq(1)
          .within(() => {
            //Removes text in cypher editor and types new query
            cy.get('.ndl-cypher-editor div[role="textbox"]')
              .should('be.visible')
              .click()
              .clear()
              .type(barChartCypherQuery);

            cy.wait(400);
            cy.get('button[aria-label="run"]').click();
          });
      });

    cy.wait(1000);
  });

  it('Checking Colour Picker settings', () => {
    //Opens advanced settings
    cy.get('.react-grid-layout')
      .first()
      .within(() => {
        //Finds the 2nd card
        cy.get('.MuiGrid-root')
          .eq(1)
          .within(() => {
            // Access advanced settings
            cy.get('button').eq(1).click();
            cy.get('[role="switch"]').click();
            cy.wait(200);
            // Changing setting for colour picker
            cy.get('[data-testid="colorpicker-input"]').find('input').click().type('{selectall}').type('red');
            cy.get('button[aria-label="run"]').click();
            // Checking that colour picker was applied correctly
            cy.get('.card-view').should('have.css', 'background-color', 'rgb(255, 0, 0)');
            cy.wait(200);
            // Changing colour back to white
            cy.get('button').eq(1).click();
            cy.get('[data-testid="colorpicker-input"]').find('input').click().type('{selectall}').type('white');
            cy.get('button[aria-label="run"]').click();
            // Checking colour has been set back to white
            cy.wait(200);
            cy.get('.card-view').should('have.css', 'background-color', 'rgb(255, 255, 255)');
          });
      });
  });

  it('Checking Selector Description', () => {
    //Opens first 2nd card
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(1)').within(() => {
      // Access advanced settings
      cy.get('button').eq(1).click();
      cy.get('[role="switch"]').click();
      cy.wait(200);
      // Changing Selector Description to 'Test'
      cy.get('.ndl-textarea').contains('span', 'Selector Description').click().type('Test');
      cy.get('button[aria-label="run"]').click();
      // Pressing Selector Description button
      cy.get('button[aria-label="details"]').click();
    });
    // Checking that Selector Description is behaving as expected
    cy.get('.MuiDialog-paper').should('be.visible').and('contain.text', 'Test');
    cy.wait(1000);

    // Click elsewhere on the page to close dialog box
    cy.get('div[role="dialog"]').parent().click(-100, -100, { force: true });
  });

  it.only('Checking full screen bar chart setting', () => {
    //Opens first 2nd card
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(1)').within(() => {
      // Opening settings
      cy.get('button').eq(1).click();
      // Activating advanced settings
      cy.get('[role="switch"]').click();
      cy.wait(200);
      // Finding fullscreen setting and changing it to 'on'
      cy.get('.ndl-dropdown')
        .contains('label', 'Fullscreen enabled')
        .scrollIntoView()
        .should('be.visible')
        .click()
        .type('on{enter}');
      // Pressing run to return to card view
      cy.get('button[aria-label="run"]').click();
      cy.get('button[aria-label="maximize"]').click();
    });
    // Modal outside of scope of card
    // Checking existence of full-screen modal
    cy.get('.dialog-xxl').should('be.visible');
    // Action to close full-screen modal
    cy.get('button[aria-label="un-maximize"]').click();
    // Checking that fullscreen has un-maximized
    // Check that the div is no longer in the DOM
    cy.get('div[data-focus-lock-disabled="false"]').should('not.exist');
  });
});
