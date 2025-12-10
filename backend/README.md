# LMS Backend API

RESTful API for the Learning Management System built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT-based authentication
- 👥 Role-based access control (Admin, Instructor, Student)
- 📚 Course management
- 📝 Enrollment management
- ✅ Input validation
- 🛡️ Secure password hashing
- 📊 MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas for production)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware
- **Logging**: morgan

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local) or MongoDB Atlas account
- npm or yarn

## Local Development Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory (see `.env.example` in root):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/lms_app
   JWT_SECRET=your-secret-key-here
   ```

   For production (MongoDB Atlas):
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lms_app
   JWT_SECRET=generate-strong-random-key
   ```

4. **Start MongoDB (if using local)**
   ```bash
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   node seed.js
   ```

   This creates:
   - 4 instructors
   - 2 admin users
   - 2 student users
   - 6 courses
   
   Default password for all users: `password123`

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with nodemon (auto-restart)
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)
- `npm run lint` - Run linter (placeholder)

## API Endpoints

### Health Check
- `GET /` - API health check
- `GET /api` - API status check

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (`/api/users`)
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Courses (`/api/courses`)
- `GET /api/courses` - Get all courses (Public)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Admin/Instructor only)
- `PUT /api/courses/:id` - Update course (Admin/Instructor only)
- `DELETE /api/courses/:id` - Delete course (Admin only)

### Enrollments (`/api/enrollments`)
- `GET /api/enrollments` - Get user enrollments (Authenticated)
- `POST /api/enrollments` - Enroll in course (Student only)
- `DELETE /api/enrollments/:id` - Unenroll from course (Student only)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin1@my.centennialcollege.ca",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## User Roles

- **Admin**: Full access to all resources
- **Instructor**: Can manage courses they teach
- **Student**: Can view courses and manage their enrollments

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── courseController.js # Course management
│   │   ├── enrollmentController.js # Enrollment logic
│   │   └── userController.js   # User management
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js     # Error handling
│   │   └── roles.js            # Role-based access control
│   ├── models/
│   │   ├── Course.js           # Course schema
│   │   ├── Enrollment.js       # Enrollment schema
│   │   └── User.js             # User schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth routes
│   │   ├── courseRoutes.js     # Course routes
│   │   ├── enrollmentRoutes.js # Enrollment routes
│   │   ├── userRoutes.js       # User routes
│   │   └── index.js            # Route aggregator
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
├── seed.js                     # Database seeding script
├── package.json
└── .env                        # Environment variables (not in git)
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/lms_app` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `NODE_ENV` | Environment (development/production/test) | `development` |

## Production Deployment

See [RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md) for detailed deployment instructions to Render.

### Quick Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=<your-atlas-connection-string>`
   - `JWT_SECRET=<generated-secret>`
4. Deploy!

## Testing

### Manual Testing with VS Code REST Client

Use the `requests.http` file with the REST Client extension:

1. Install REST Client extension in VS Code
2. Open `requests.http`
3. Click "Send Request" above each request

### Test Users (after seeding)

| Email | Password | Role |
|-------|----------|------|
| admin1@my.centennialcollege.ca | password123 | admin |
| admin2@my.centennialcollege.ca | password123 | admin |
| student1@my.centennialcollege.ca | password123 | student |
| student2@my.centennialcollege.ca | password123 | student |
| karthik@my.centennialcollege.ca | password123 | instructor |
| konstantin@my.centennialcollege.ca | password123 | instructor |
| arindam@my.centennialcollege.ca | password123 | instructor |
| vaishali@my.centennialcollege.ca | password123 | instructor |

## Error Handling

The API uses consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- CORS enabled for cross-origin requests
- Input validation on all endpoints
- Role-based access control

## Troubleshooting

### MongoDB Connection Issues

**Local MongoDB:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

**MongoDB Atlas:**
- Verify connection string format
- Check Network Access settings (whitelist 0.0.0.0/0 for development)
- Ensure database user credentials are correct

### Port Already in Use

```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or change PORT in .env
PORT=5001
```

### JWT Errors

- Ensure JWT_SECRET is set in .env
- Check token format: `Bearer <token>`
- Verify token hasn't expired

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please create an issue in the GitHub repository.
