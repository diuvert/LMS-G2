import { test, expect } from '@playwright/test';

// Constants
const API_URL = 'http://127.0.0.1:5000/api';
const USER_EMAIL = `testuser_${Date.now()}@example.com`;
const USER_PASS = 'password123';
const USER_NAME = 'Test User';

test.describe('E2E Vertical & Horizontal Tests', () => {

    // Horizontal Flow (UI)
    test('Horizontal Flow: Login -> Course -> Enroll -> Welcome', async ({ page }) => {
        // 1. Register a user first (Hybrid: use UI or API for setup? Let's use UI for full flow)
        // Actually, to make it robust, let's Register via UI
        await page.goto('/register');
        await page.fill('input[placeholder="Enter your full name"]', USER_NAME);
        await page.fill('input[placeholder="Enter your username or email"]', USER_EMAIL);
        await page.fill('input[placeholder="Enter your password"]', USER_PASS);
        await page.fill('input[placeholder="Confirm your password"]', USER_PASS);
        // Role is student by default
        await page.click('button:has-text("Submit")');

        // Should pass through login automatically or redirect to login? 
        // Based on usual flows, verify where we land. Assuming auto-login or redirect to login.
        // Let's assume redirect to login or courses.
        // If we land on Login page:
        if (await page.getByText('Sign In').isVisible()) {
            await page.fill('input[placeholder="Email Address"]', USER_EMAIL);
            await page.fill('input[type="password"]', USER_PASS);
            await page.click('button:has-text("Sign In")');
        }

        await expect(page).toHaveURL(/.*\/courses/);

        // 2. View Courses
        // Wait for courses to load
        const enrollButtons = page.locator('button:has-text("Enroll Now")');
        await expect(enrollButtons.first()).toBeVisible();

        // Get course title for validation later
        const courseTitle = await page.locator('h3').first().textContent();

        // 3. Enroll
        await enrollButtons.first().click();

        // Handle alert if any (browsers auto-dismiss or we need to handle dialog)
        page.on('dialog', dialog => dialog.accept());

        // Should wait for navigation to enrollments
        await expect(page).toHaveURL(/.*\/enrollments/);

        // 4. Continue to Welcome
        const continueBtn = page.locator('button:has-text("Continue")').first();
        await expect(continueBtn).toBeVisible();
        await continueBtn.click();

        // 5. Verify Welcome Page
        await expect(page).toHaveURL(/.*\/welcome/);
        await expect(page.getByText(`Hello ${USER_NAME}`)).toBeVisible();
        if (courseTitle) {
            await expect(page.getByText(courseTitle)).toBeVisible();
        }
    });

    // Vertical Flow (API)
    test('Vertical Flow: API Verification', async ({ request }) => {
        // 1. Auth Login (Vertical verify of Auth Service)
        const loginRes = await request.post(`${API_URL}/auth/login`, {
            data: {
                email: USER_EMAIL, // Using the user created in previous test might be risky due to order.
                // Let's create a fresh user for API tests via register endpoint
                password: USER_PASS
            }
        });

        // If user doesn't exist (because UI test ran in parallel or failed), we might fail.
        // Better to Register a dedicated API user.
        const apiUserEmail = `api_${Date.now()}@test.com`;
        const regRes = await request.post(`${API_URL}/auth/register`, {
            data: { name: 'API User', email: apiUserEmail, password: 'password123', role: 'student' }
        });
        expect(regRes.ok()).toBeTruthy();
        const regData = await regRes.json();
        expect(regData).toHaveProperty('token');
        expect(regData.user).toHaveProperty('email', apiUserEmail);

        // Store token
        const token = regData.token;

        // 2. GET Courses (Vertical verify of Course Service & DB)
        const coursesRes = await request.get(`${API_URL}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(coursesRes.ok()).toBeTruthy();
        const courses = await coursesRes.json();
        expect(Array.isArray(courses)).toBeTruthy();
        if (courses.length > 0) {
            expect(courses[0]).toHaveProperty('_id');
            expect(courses[0]).toHaveProperty('title');
            // Verify DB Seeding / Data Integrity
        }

        // 3. Enrollment Logic (Vertical verify of Enrollment Service)
        if (courses.length > 0) {
            const courseId = courses[0]._id;

            // Enroll
            const enrollRes = await request.post(`${API_URL}/enrollments`, {
                data: { courseId },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            expect(enrollRes.ok()).toBeTruthy();

            // Verify Content
            const enrollData = await enrollRes.json();
            expect(enrollData).toHaveProperty('course');

            // Verify Business Logic: Duplicate Enrollment Prevention (409)
            const dupRes = await request.post(`${API_URL}/enrollments`, {
                data: { courseId },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            expect(dupRes.status()).toBe(409);
        }
    });

});
