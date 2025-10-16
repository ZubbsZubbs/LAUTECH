# 🏥 LAUTECH Teaching Hospital - Project Setup Guide

## 📁 Project Structure

```
C:\Users\Admin\Desktop\LAUTECH\
├── frontend/          # Next.js React application
├── backend/           # Node.js TypeScript API
└── SETUP_GUIDE.md    # This file
```

## 🚀 Quick Start

### 1. Frontend Setup (Already Done ✅)
Your frontend is already set up and working. It's a Next.js application with:
- Hospital website pages
- Admin dashboard
- Contact forms
- Email subscriptions

### 2. Backend Setup (New! 🆕)

#### Prerequisites:
- **PostgreSQL** database installed
- **Node.js** (v18 or higher)

#### Steps:

1. **Navigate to backend folder:**
   ```bash
   cd C:\Users\Admin\Desktop\LAUTECH\backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the backend folder
   - Copy the configuration from the example below

4. **Set up PostgreSQL database:**
   - Create a database named `lautech_hospital_db`
   - Update the database credentials in `.env`

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

## 🔧 Environment Configuration

Create `backend/.env` file with:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=lautech_hospital_db
DB_URL=postgresql://postgres:your_password_here@localhost:5432/lautech_hospital_db

# Server Configuration
PORT=9000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=LAUTECH Teaching Hospital <noreply@lautech-hospital.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🌐 Running Both Applications

### Terminal 1 - Frontend:
```bash
cd C:\Users\Admin\Desktop\LAUTECH\frontend
npm run dev
```
Frontend will run on: http://localhost:3000

### Terminal 2 - Backend:
```bash
cd C:\Users\Admin\Desktop\LAUTECH\backend
npm run dev
```
Backend will run on: http://localhost:9000

## 🔗 Integration Points

### Current Frontend API Calls:
Your frontend currently uses Next.js API routes:
- `/api/contact` - Contact form submission
- `/api/subscribe` - Email subscription

### New Backend API Endpoints:
The backend provides these endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/contact` - Contact form (can replace frontend version)
- `GET /api/user/profile` - User profile
- `GET /health` - Health check

## 🏥 Hospital-Specific Features Available

The backend includes:
- **User Authentication** with JWT tokens
- **Role-based Access** (Admin/User)
- **Social Login** (Google, Facebook, LinkedIn)
- **Two-Factor Authentication**
- **Email Services** for notifications
- **File Upload** capabilities
- **Database Models** for users, contacts, events

## 📝 Next Steps

1. **Set up PostgreSQL** database
2. **Configure environment variables**
3. **Test backend API** endpoints
4. **Update frontend** to use backend APIs
5. **Add hospital-specific models** (patients, doctors, appointments)

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Port Already in Use:**
   - Change PORT in `.env` file
   - Kill existing processes on that port

3. **CORS Errors:**
   - Ensure FRONTEND_URL is correct in `.env`
   - Check that frontend is running on the correct port

4. **Module Not Found:**
   - Run `npm install` in backend folder
   - Check Node.js version compatibility

## 🎯 Benefits of This Setup

- **Scalable Architecture**: Separate frontend and backend
- **Database Integration**: PostgreSQL for data persistence
- **Authentication**: Secure user management
- **API-First**: Easy to extend with mobile apps
- **Modern Stack**: TypeScript, TypeORM, JWT
- **Production Ready**: Proper error handling, validation, security

Your project is now ready for full-stack development! 🚀
