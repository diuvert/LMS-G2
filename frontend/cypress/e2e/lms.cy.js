describe('LMS E2E Tests', () => {
    const API_URL = 'https://lms-g2.onrender.com/api';
    const USER_NAME = 'Cypress User';
    const USER_EMAIL = `cypress_${Date.now()}@test.com`;
    const USER_PASS = 'password123';

    // Horizontal Flow (UI)
    it('Horizontal Flow: Register -> Login -> Course -> Enroll -> Welcome', () => {
        // 1. Register
        cy.visit('/register');
        cy.get('input[placeholder="Enter your full name"]').type(USER_NAME);
        cy.get('input[placeholder="Enter your username or email"]').type(USER_EMAIL);
        cy.get('input[placeholder="Enter your password"]').type(USER_PASS);
        cy.get('input[placeholder="Confirm your password"]').type(USER_PASS);
        cy.contains('button', 'Submit').click();

        // Should redirect to Courses or Login. Assuming same flow as Playwright.
        // If login is required manually:
        cy.document().then((doc) => {
            if (doc.body.innerText.includes('Sign In')) {
                cy.get('input[placeholder="Email Address"]').type(USER_EMAIL);
                cy.get('input[placeholder="password"]').type(USER_PASS); // Selector might vary, assuming generic type or name
                // Better selector:
                cy.get('input[type="password"]').type(USER_PASS);
                cy.contains('button', 'Sign In').click();
            }
        });

        // 2. View Courses
        cy.url().should('include', '/courses');
        cy.contains('button', 'Enroll Now').should('be.visible').first().click();

        // Handle potential alerts (Cypress auto-accepts, but good to know)

        // 3. Enrollments
        cy.url().should('include', '/enrollments');
        cy.contains('button', 'Continue').first().click();

        // 4. Welcome Page
        cy.url().should('include', '/welcome');
        cy.contains(`Hello ${USER_NAME}`).should('be.visible');
    });

    // Vertical Flow (API)
    it('Vertical Flow: API Verification', () => {
        const apiUserEmail = `cy_api_${Date.now()}@test.com`;

        // 1. Auth Register/Login
        cy.request('POST', `${API_URL}/auth/register`, {
            name: 'Cypress API',
            email: apiUserEmail,
            password: 'password123',
            role: 'student'
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('token');
            const token = response.body.token;

            // 2. GET Courses
            cy.request({
                method: 'GET',
                url: `${API_URL}/courses`,
                headers: { Authorization: `Bearer ${token}` }
            }).then((resCourses) => {
                expect(resCourses.status).to.eq(200);
                expect(resCourses.body).to.be.an('array');

                if (resCourses.body.length > 0) {
                    const courseId = resCourses.body[0]._id;

                    // 3. Enroll
                    cy.request({
                        method: 'POST',
                        url: `${API_URL}/enrollments`,
                        headers: { Authorization: `Bearer ${token}` },
                        body: { courseId }
                    }).then((resEnroll) => {
                        expect(resEnroll.status).to.eq(201);
                        expect(resEnroll.body).to.have.property('course');

                        // 4. Duplicate Enrollment Check (409)
                        cy.request({
                            method: 'POST',
                            url: `${API_URL}/enrollments`,
                            headers: { Authorization: `Bearer ${token}` },
                            body: { courseId },
                            failOnStatusCode: false // We expect 409
                        }).then((resDup) => {
                            expect(resDup.status).to.eq(409);
                        });
                    });
                }
            });
        });
    });
});
