const { defineConfig } = require("cypress");

module.exports = defineConfig({
    projectId: "k1qpo5",
    e2e: {
        baseUrl: "https://lms-g2.netlify.app/",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        supportFile: false, // Disabling support file for simplicity if not needed, or let it default.
        // If we want default support file (cypress/support/e2e.js), we can leave it or create it.
        // For this task, setting to false to avoid missing file errors if we don't create it.
        // actually, let's keep it standard. Cypress initializes it usually.
        // But to be safe and avoiding "file not found", I'll set it to false for this specific "single file suite" approach unless I run 'npx cypress open' which scaffolds everything.
        // Since I am manually creating files, 'false' is safer.
        supportFile: false,
    },
});
