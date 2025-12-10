const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config({ path: '.env.test' });

let testDbUri;

// Setup test database connection
beforeAll(async () => {
  // Use environment variable or Atlas test database
  testDbUri = process.env.MONGO_URI;
  
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Connect to test database
  await mongoose.connect(testDbUri);
  console.log(`✓ Connected to test database: ${mongoose.connection.name}`);
}, 60000); // Increased timeout for Atlas connection

// Clear database before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // Only drop test database, not production
    if (mongoose.connection.name.includes('test')) {
      await mongoose.connection.dropDatabase();
    }
    await mongoose.connection.close();
  }
}, 60000);

// Helper function to create a test user
async function createTestUser(userData = {}) {
  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'student'
  };
  
  const user = await User.create({ ...defaultUser, ...userData });
  return user;
}

// Helper function to generate JWT token
function generateToken(userId, role) {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '7d' }
  );
}

// Helper function to create authenticated user with token
async function createAuthenticatedUser(role = 'student') {
  const user = await createTestUser({ role });
  const token = generateToken(user._id, user.role);
  return { user, token };
}

module.exports = {
  createTestUser,
  generateToken,
  createAuthenticatedUser
};
