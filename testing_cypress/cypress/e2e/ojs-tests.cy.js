let WAIT_TIME_MS = 1500;

describe('OJS Frontend Tests', () => {
    const BASE_URL = Cypress.env('BASE_URL') || 'http://localhost';
    let ARTICLE_URL = '';
    let ARTICLE_ID = '';
    let GALLEY_ID = '';

    beforeEach(() => {
        // Reset variables for each test
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
    });

    it('Test 1: Startseite loads with correct elements', () => {
        cy.request(BASE_URL).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(BASE_URL);
        cy.get('div.pkp_structure_page').should('exist');
    });

    it('Test 2: Current issue page loads and sets ARTICLE_URL', () => {
        cy.request(BASE_URL + '/issue/current').then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(BASE_URL + '/issue/current');

        // Extract article URL from the current issue page
        cy.get('a[href*="/article/view/"]').first().then(($link) => {
            ARTICLE_URL = $link.attr('href');
            // Extract article ID from URL for later tests
            const match = ARTICLE_URL.match(/\/article\/view\/(\d+)/);
            if (match) {
                ARTICLE_ID = match[1];
            }
        });
    });

    it('Test 3: Article detail page loads correctly', () => {
        // This test depends on Test 2
        cy.visit(BASE_URL + '/issue/current');
        cy.get('a[href*="/article/view/"]').first().click();

        cy.url().should('include', '/article/view/');
        cy.get('div.pkp_structure_page').should('exist');
    });

    it('Test 4: Journal archive page loads', () => {
        cy.request(BASE_URL + '/issue/archive').then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(BASE_URL + '/issue/archive');
    });

    // it('Test 6: Galley view loads correctly', () => {
    //     // This test requires article ID and galley ID
    //     cy.visit(BASE_URL + '/issue/current');
    //     cy.get('a[href*="/article/view/"]').first().then(($link) => {
    //         const href = $link.attr('href');
    //         const articleMatch = href.match(/\/article\/view\/(\d+)/);
    //         if (articleMatch) {
    //             const articleId = articleMatch[1];
    //             // Try to find galley links
    //             cy.visit(href);
    //             cy.get('a[href*="/article/view/' + articleId + '/"]').then(($galleys) => {
    //                 if ($galleys.length > 0) {
    //                     const galleyHref = $galleys.first().attr('href');
    //                     cy.request(galleyHref).its('status').should('eq', 200);
    //                 }
    //             });
    //         }
    //     });
    // });

    it('Test 9: Navigation element exists', () => {
        cy.visit(BASE_URL);
        cy.get('div.pkp_navigation_primary_wrapper').should('exist');
    });

    it('Test 12: Sidebar and footer elements exist', () => {
        cy.visit(BASE_URL);
        cy.get('div.pkp_structure_sidebar.left').should('exist');
        cy.get('div.pkp_structure_footer_wrapper').should('exist');
    });

    it('Test 14: Search functionality exists', () => {
        cy.request(BASE_URL + '/search').then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(BASE_URL + '/search');
        cy.get('.search_input').should('exist');
    });

});


describe('OJS Backend Tests', () => {
    const BASE_URL = Cypress.env('BASE_URL') || 'http://localhost';
    const USERNAME = Cypress.env('BACKEND_USERNAME') || 'admin';
    const PASSWORD = Cypress.env('BACKEND_PASSWORD') || 'admin';


    beforeEach(() => {
        // Login before each backend test
        cy.session('backend-login', () => {
            cy.visit(BASE_URL + '/login/legacyLogin');
            cy.get('input[name="username"]').type(USERNAME);
            cy.get('input[name="password"]').type(PASSWORD, { log: false });
            cy.get('button[type="submit"]').click();
            cy.url().should('include', '/submissions');
        });
    });

    it('Test 17: Standard OJS Login works', () => {
        cy.visit(BASE_URL + '/submissions');
        cy.url().should('include', '/submissions');
        cy.request(BASE_URL + '/submissions').its('status').should('eq', 200);
    });

    it('Test 20: Plugin gallery loads', () => {
        cy.visit(BASE_URL + '/management/settings/website#plugins/pluginGallery');
        cy.wait(WAIT_TIME_MS); // Wait for plugins to load
        cy.get('[id*="component-grid-plugins-plugingallerygrid-row"]').first().should('exist');
    });

    it('Test 21: Issues overview loads', () => {
        cy.visit(BASE_URL + '/manageIssues');
        cy.wait(WAIT_TIME_MS); // Wait for plugins to load


        cy.request(BASE_URL + '/manageIssues').its('status').should('eq', 200);
        // cy.get('.manageIssues').should('exist');
        cy.get('[id^="component-grid-issues-futureissuegrid-addIssue-button-"]')
    });

    it('Test 22: Plugin list in website settings loads', () => {
        cy.visit(BASE_URL + '/management/settings/website#plugins');
        cy.wait(WAIT_TIME_MS); // Wait for plugins to load

        cy.request(BASE_URL + '/management/settings/website').its('status').should('eq', 200);
    });

    it('Test 25: Statistics overview loads with content', () => {
        cy.visit(BASE_URL + '/stats/publications/publications');
        cy.get('table').should('exist');
    });

    it('Test 26: Submissions overview loads', () => {
        cy.visit(BASE_URL + '/submissions#active');
        cy.request(BASE_URL + '/submissions').its('status').should('eq', 200);
        //cy.get('a[href*="/submission/wizard"]').should('exist');
        cy.get('#active > .submissionsListPanel > .listPanel > .listPanel__header > .pkpHeader > .pkpHeader__actions > a.pkpButton')
    });

    it('Test 27: Users overview loads', () => {
        cy.visit(BASE_URL + '/management/settings/access#users');
        cy.request(BASE_URL + '/management/settings/access').its('status').should('eq', 200);
        cy.get('#component-grid-settings-user-usergrid-row-1').should('exist');
    });
});


describe('OJS Administration Tests', () => {
    const BASE_URL_ADMIN = Cypress.env('BASE_URL_ADMIN') || 'http://localhost';

    beforeEach(() => {
        // Login as admin before each test
        cy.session('admin-login', () => {
            cy.visit(BASE_URL_ADMIN + '/login/legacyLogin');
            cy.get('input[name="username"]').type(Cypress.env('ADMIN_USERNAME') || 'admin');
            cy.get('input[name="password"]').type(Cypress.env('ADMIN_PASSWORD') || 'admin', { log: false });
            cy.get('button[type="submit"]').click();
        });
    });

    it('Test 28: Administration page loads', () => {
        cy.request(BASE_URL_ADMIN + '/admin/index').its('status').should('eq', 200);
        cy.visit(BASE_URL_ADMIN + '/admin/index');
    });

    it('Test 29: System information displays', () => {
        cy.request(BASE_URL_ADMIN + '/admin/systemInfo').its('status').should('eq', 200);
        cy.visit(BASE_URL_ADMIN + '/admin/systemInfo');
    });
});

describe('OJS Navigation Tests', () => {
    const BASE_URL = Cypress.env('BASE_URL') || 'http://localhost';

    it('Test 10: Navigation links lead to correct pages', () => {
        cy.visit(BASE_URL);

        // Test main navigation links
        cy.get('div.pkp_navigation_primary_wrapper a').each(($link) => {
            const href = $link.attr('href');
            if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && href.startsWith(BASE_URL)) {
                cy.request(href).its('status').should('be.oneOf', [200, 302]);
            }
        });
    });
});
