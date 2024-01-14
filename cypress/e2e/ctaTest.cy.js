// This is a Cypress test script
describe('Adobe Data Layer Verification Scenario', () => {
  it('should accept cookies and grab Adobe Data Layer info', () => {
    // Visit the website
    cy.visit('https://www.herbalife.com/en-sg');
    // Wait for the page to load
    cy.wait(2000); // Adjust the wait time as needed
    // Accept cookies

    cy.get('#onetrust-accept-btn-handler').click();
    cy.log('Cookies accepted.');
    // Wait for the page to load
    cy.wait(2000); // Adjust the wait time as needed

    // Capture AdobeDataLayer before clicking the button
    let adobeDataLayerBeforeClick;
    cy.window().then((win) => {
      adobeDataLayerBeforeClick = win.adobeDataLayer || [];
      if (adobeDataLayerBeforeClick.length > 0) {
        // Save Adobe Data Layer to a file (e.g., JSON format)
        const filePath = 'cypress/fixtures/adobeDataLayerBefore.json'; // Specify the file path
        cy.writeFile(filePath, JSON.stringify(adobeDataLayerBeforeClick));
      } else {
        cy.log('Adobe Data Layer is empty or undefined. Unable to save to a file.');
      }
    });

    // Change the href attribute to "#" for all links
    cy.get('a').each(($link) => {
      $link.attr('href', '#');
    });

    // Find the button and click it
    cy.get('.cmp-cta-button.cmp-cta-button--has-icon.h1-cmp-theme-button-colors:first').click();
    cy.log('Button clicked.');
    cy.wait(2000);

    // Capture AdobeDataLayer after clicking the button
    let adobeDataLayerAfterClick;
    cy.window().then((win) => {
      adobeDataLayerAfterClick = win.adobeDataLayer || [];
      // Check if Adobe Data Layer is available
      if (adobeDataLayerAfterClick.length > 0) {
        // Save Adobe Data Layer to a file (e.g., JSON format)
        const filePath = 'cypress/fixtures/adobeDataLayerAfter.json'; // Specify the file path
        cy.writeFile(filePath, JSON.stringify(adobeDataLayerAfterClick));
        // Assertion: Check if adobeDataLayerAfterClick contains the expected event and link position
        const expectedEvent = 'cta';
        const expectedLinkPosition = 'live-your-best-life_hero-banner-carousel-component';

        cy.wrap(adobeDataLayerAfterClick).should((data) => {
          expect(data.some(entry => entry.event === expectedEvent && entry.link?.linkPosition === expectedLinkPosition),
         'Adobe Data Layer contains expected event and link position').to.be.true;
        });
      } else {
        cy.log('Adobe Data Layer is empty or undefined. Unable to save to a file.');
      }
    });

    // Manipulate AdobeDataLayer if needed
    cy.window().then((win) => {
      win.adobeDataLayer = [];
    });
  });
});
