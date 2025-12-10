const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const { createTestUser, createAuthenticatedUser } = require('../setup');

describe('User Controller Tests', () => {
  
  describe('GET /api/users', () => {
    test('should return all users when authenticated as admin', async () => {
      // Create admin user
      const { token } = await createAuthenticatedUser('admin');
      
      // Create some test users
      await createTestUser({ name: 'User 1', email: 'user1@example.com' });
      await createTestUser({ name: 'User 2', email: 'user2@example.com' });
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3); // 2 test users + 1 admin
      expect(response.body[0]).not.toHaveProperty('password'); // Password should be excluded
    });

    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/users');
      
      expect(response.status).toBe(401);
    });

    test('should return 403 when authenticated as non-admin (student)', async () => {
      const { token } = await createAuthenticatedUser('student');
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(403);
      expect(response.body.message).toBeDefined();
    });

    test('should return 403 when authenticated as instructor', async () => {
      const { token } = await createAuthenticatedUser('instructor');
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/users', () => {
    test('should create a new user when authenticated as admin with valid data', async () => {
      const { token } = await createAuthenticatedUser('admin');
      
      const newUser = {
        name: 'New Test User',
        email: 'newuser@example.com',
        password: 'securePassword123',
        role: 'student'
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.role).toBe(newUser.role);
      expect(response.body).not.toHaveProperty('password'); // Password should not be returned
      
      // Verify user was created in database
      const createdUser = await User.findById(response.body.id);
      expect(createdUser).toBeTruthy();
      expect(createdUser.email).toBe(newUser.email);
    });

    test('should return 409 when email already exists', async () => {
      const { token } = await createAuthenticatedUser('admin');
      await createTestUser({ email: 'existing@example.com' });
      
      const newUser = {
        name: 'Duplicate User',
        email: 'existing@example.com',
        password: 'password123',
        role: 'student'
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser);
      
      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/email already in use/i);
    });

    test('should return 400 when required fields are missing', async () => {
      const { token } = await createAuthenticatedUser('admin');
      
      const incompleteUser = {
        name: 'Incomplete User'
        // Missing email, password, role
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(incompleteUser);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 when email format is invalid', async () => {
      const { token } = await createAuthenticatedUser('admin');
      
      const invalidUser = {
        name: 'Invalid Email User',
        email: 'not-an-email',
        password: 'password123',
        role: 'student'
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidUser);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 when password is too short', async () => {
      const { token } = await createAuthenticatedUser('admin');
      
      const weakPasswordUser = {
        name: 'Weak Password User',
        email: 'weak@example.com',
        password: '123', // Less than 6 characters
        role: 'student'
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(weakPasswordUser);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 when role is invalid', async () => {
      const { token } = await createAuthenticatedUser('admin');
      
      const invalidRoleUser = {
        name: 'Invalid Role User',
        email: 'invalidrole@example.com',
        password: 'password123',
        role: 'superadmin' // Invalid role
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidRoleUser);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should return 403 when authenticated as non-admin', async () => {
      const { token } = await createAuthenticatedUser('student');
      
      const newUser = {
        name: 'Unauthorized User',
        email: 'unauthorized@example.com',
        password: 'password123',
        role: 'student'
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser);
      
      expect(response.status).toBe(403);
    });

    test('should return 401 when not authenticated', async () => {
      const newUser = {
        name: 'Unauthenticated User',
        email: 'unauth@example.com',
        password: 'password123',
        role: 'student'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user when authenticated as admin', async () => {
      const { token } = await createAuthenticatedUser('admin');
      const user = await createTestUser({ 
        name: 'Original Name',
        email: 'original@example.com',
        role: 'student'
      });
      
      const updates = {
        name: 'Updated Name',
        role: 'instructor'
      };
      
      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);
      expect(response.body.role).toBe(updates.role);
      expect(response.body.email).toBe('original@example.com'); // Email unchanged
      
      // Verify in database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.name).toBe(updates.name);
      expect(updatedUser.role).toBe(updates.role);
    });

    test('should update email when new email is provided and not duplicate', async () => {
      const { token } = await createAuthenticatedUser('admin');
      const user = await createTestUser({ email: 'old@example.com' });
      
      const updates = {
        email: 'new@example.com'
      };
      
      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(updates.email);
    });

    test('should return 409 when updating to an email that already exists', async () => {
      const { token } = await createAuthenticatedUser('admin');
      await createTestUser({ email: 'taken@example.com' });
      const user = await createTestUser({ email: 'original@example.com' });
      
      const updates = {
        email: 'taken@example.com'
      };
      
      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);
      
      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/email already in use/i);
    });

    test('should return 404 when user does not exist', async () => {
      const { token } = await createAuthenticatedUser('admin');
      const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
      
      const updates = {
        name: 'Updated Name'
      };
      
      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/user not found/i);
    });

    test('should return 403 when authenticated as non-admin', async () => {
      const { token } = await createAuthenticatedUser('student');
      const user = await createTestUser();
      
      const updates = {
        name: 'Unauthorized Update'
      };
      
      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);
      
      expect(response.status).toBe(403);
    });

    test('should return 401 when not authenticated', async () => {
      const user = await createTestUser();
      
      const updates = {
        name: 'Unauthenticated Update'
      };
      
      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send(updates);
      
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete user when authenticated as admin', async () => {
      const { token } = await createAuthenticatedUser('admin');
      const user = await createTestUser({ email: 'todelete@example.com' });
      
      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
      
      // Verify user is deleted from database
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    test('should return 404 when user does not exist', async () => {
      const { token } = await createAuthenticatedUser('admin');
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/user not found/i);
    });

    test('should return 403 when authenticated as non-admin (student)', async () => {
      const { token } = await createAuthenticatedUser('student');
      const user = await createTestUser();
      
      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(403);
      expect(response.body.message).toBeDefined();
    });

    test('should return 403 when authenticated as instructor', async () => {
      const { token } = await createAuthenticatedUser('instructor');
      const user = await createTestUser();
      
      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(403);
    });

    test('should return 401 when not authenticated', async () => {
      const user = await createTestUser();
      
      const response = await request(app)
        .delete(`/api/users/${user._id}`);
      
      expect(response.status).toBe(401);
    });
  });
});
