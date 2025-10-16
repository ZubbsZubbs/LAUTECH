# LAUTECH Teaching Hospital - Backend API

This is the backend API for the LAUTECH Teaching Hospital project, built with Node.js, TypeScript, Express.js, and PostgreSQL.

## 🚀 Features

- **Authentication System** with JWT tokens
- **Social Authentication** (Google, Facebook, LinkedIn)
- **Two-Factor Authentication** (2FA)
- **User Management** with role-based access
- **Email Services** (Nodemailer)
- **Database Integration** (PostgreSQL with TypeORM)
- **File Upload** capabilities
- **CORS** configured for frontend integration

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration.

3. **Set up PostgreSQL database:**
   - Create a database named `lautech_hospital_db`
   - Update database credentials in `.env`

4. **Run database migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/facebook` - Facebook OAuth
- `POST /api/auth/linkedin` - LinkedIn OAuth

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/users` - Get all users (Admin only)

### Contact
- `POST /api/contact` - Submit contact form

### Health Check
- `GET /health` - Server health status

## 🔒 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=lautech_hospital_db

# Server
PORT=9000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🏥 Hospital-Specific Features

This backend is adapted for hospital management with:
- Patient management capabilities
- Doctor profile management
- Appointment scheduling
- Department management
- Medical record handling

## 📝 Notes

- The server runs on port 9000 by default
- CORS is configured to allow requests from the frontend
- All API responses are in JSON format
- Authentication is required for protected routes
