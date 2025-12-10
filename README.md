# 🎓 Student Activity Record Platform - Full MERN Stack

**Centralised Digital Platform for Comprehensive Student Activity Record in Higher Education Institutions (HEIs)**

A complete production-ready full-stack MERN platform for tracking, managing, and showcasing student activities in higher education institutions.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Deployment](#deployment)

---

## 🎯 Overview

This platform serves as a **single source of truth** for a student's complete activity history, enabling:

- **Students** to record all academic, co-curricular, extra-curricular, internships, certifications, events, and achievements
- **Faculty** to verify and approve student activities with feedback
- **Admin** to monitor all activity logs across departments with comprehensive analytics

---

## ✨ Features

### 👩‍🎓 Student Features
- ✅ Complete profile management with attendance tracking
- ✅ Add and manage activities (Academics, Certifications, Internships, Workshops, Events, etc.)
- ✅ Upload proof documents (PDF, images)
- ✅ Track activity status (Pending → Under Review → Approved/Rejected)
- ✅ View activity history with filtering and search
- ✅ **Activity Score System** - Earn points for each activity based on type, level, and achievement
- ✅ **Badge System** - Gold, Silver, Bronze badges based on activity score
- ✅ **Activity Timeline** - Visual representation of activity progress
- ✅ Real-time notifications for approvals/rejections
- ✅ Generate and download comprehensive activity reports (PDF)
- ✅ Dashboard with statistics and charts

### 👨‍🏫 Faculty Features
- ✅ View students list with activity statistics
- ✅ Review and approve/reject submitted activities
- ✅ Add remarks and feedback
- ✅ Track student progress over time
- ✅ Department-wise filtering
- ✅ Download department reports
- ✅ Faculty dashboard with pending approvals count

### 🏛️ Admin Features
- ✅ Comprehensive admin dashboard with analytics
- ✅ User management (Add/Edit/Delete users)
- ✅ Department management
- ✅ View all activities across departments
- ✅ Analytics dashboard with:
  - Total activities submitted
  - Pending approvals count
  - Top performing students
  - Department-wise comparison
  - Activity type distribution
  - Monthly activity trends
- ✅ Export data and generate reports
- ✅ System-wide statistics and insights

### 🔥 Unique Features
- ✅ **Activity Score Calculation** - Intelligent scoring based on type, level, duration, and achievement
- ✅ **Badge System** - Gamification with Gold (500+), Silver (300+), Bronze (100+) badges
- ✅ **Real-time Notifications** - Socket.IO powered instant updates
- ✅ **Activity Suggestions** - AI-powered suggestions for missing activities
- ✅ **Role-based Hierarchy** - Student → Faculty → Admin workflow
- ✅ **Activity Timeline Visualization** - GitHub-like contribution chart
- ✅ **Comprehensive PDF Reports** - Professional activity reports

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time notifications
- **Multer** - File uploads
- **PDFKit** - PDF generation
- **Express Validator** - Input validation
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **Recharts** - Data visualization
- **React Toastify** - Notifications
- **Lucide React** - Icons
- **Vite** - Build tool

---

## 📁 Project Structure

```
React-Node/
├── server/                      # Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── activityController.js
│   │   ├── facultyController.js
│   │   ├── adminController.js
│   │   ├── notificationController.js
│   │   └── reportController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── uploadMiddleware.js # File upload handling
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Activity.js         # Activity schema
│   │   ├── Department.js
│   │   ├── Notification.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── activityRoutes.js
│   │   ├── facultyRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── reportRoutes.js
│   ├── uploads/                # Uploaded files
│   ├── .env                    # Environment variables
│   ├── .env.example
│   ├── index.js                # Server entry point
│   └── package.json
│
├── client/                     # Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx      # Main layout wrapper
│   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── student/
│   │   │   │   ├── StudentProfile.jsx  # Dashboard matching your image
│   │   │   │   ├── AddActivity.jsx
│   │   │   │   ├── ActivityList.jsx
│   │   │   │   └── ActivityDetail.jsx
│   │   │   ├── faculty/
│   │   │   │   ├── FacultyDashboard.jsx
│   │   │   │   ├── FacultyReview.jsx
│   │   │   │   └── StudentsList.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   └── DepartmentManagement.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── activitySlice.js
│   │   │       ├── userSlice.js
│   │   │       ├── notificationSlice.js
│   │   │       └── departmentSlice.js
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/student_activity_platform
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if not running):
   ```bash
   mongod
   ```

5. **Run the server:**
   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Client will start at `http://localhost:3000`

### Seed Database (Optional)

To create sample users and data for testing, you can manually create users through the signup page or use MongoDB Compass to insert sample data.

**Sample Admin User:**
```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "$2a$10$...",  // hashed: password123
  "role": "admin",
  "isActive": true
}
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/auth/updatepassword` | Update password | Private |
| POST | `/auth/logout` | Logout user | Private |

### Activity Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/activities` | Get all activities for logged-in student | Student |
| POST | `/activities` | Create new activity | Student |
| GET | `/activities/:id` | Get single activity | Private |
| PUT | `/activities/:id` | Update activity | Student |
| DELETE | `/activities/:id` | Delete activity | Student |
| POST | `/activities/:id/documents` | Upload documents | Student |
| GET | `/activities/stats` | Get activity statistics | Student |

### Faculty Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/faculty/dashboard` | Get faculty dashboard stats | Faculty |
| GET | `/faculty/students` | Get students list | Faculty |
| GET | `/faculty/activities` | Get activities for review | Faculty |
| PUT | `/faculty/activities/:id/review` | Approve/Reject activity | Faculty |
| GET | `/faculty/students/:id/activities` | Get student activities | Faculty |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/admin/dashboard` | Get admin dashboard | Admin |
| GET | `/admin/users` | Get all users | Admin |
| POST | `/admin/users` | Create new user | Admin |
| PUT | `/admin/users/:id` | Update user | Admin |
| DELETE | `/admin/users/:id` | Delete user | Admin |
| GET | `/admin/departments` | Get all departments | Admin |
| POST | `/admin/departments` | Create department | Admin |
| GET | `/admin/analytics` | Get system analytics | Admin |

### Other Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | Get user notifications | Private |
| PUT | `/notifications/:id/read` | Mark as read | Private |
| GET | `/reports/student/:id/pdf` | Generate student PDF | Private |
| GET | `/departments` | Get all departments | Public |

---

## 👥 User Roles

### 1. Student
- Can add, edit, delete own activities
- View activity history and statistics
- Upload documents and proofs
- Track approval status
- Generate personal reports
- Earn badges and activity scores

### 2. Faculty
- Review and approve/reject activities
- View students from their department
- Add remarks and feedback
- Track student progress
- Generate department reports

### 3. Admin
- Full system access
- User and department management
- System-wide analytics
- View all activities across departments
- Generate comprehensive reports

---

## 🎨 Key Features Explained

### Activity Score System
Each activity is scored based on:
- **Activity Type** (Certification: 10, Internship: 15, Research: 20, Publication: 25, etc.)
- **Level Multiplier** (Department: 1x, College: 1.2x, National: 2x, International: 2.5x)
- **Achievement Bonus** (Winner: 20, Runner-up: 15, Publication: 25, etc.)
- **Duration Bonus** (For internships and projects)

### Badge System
- **Bronze Badge**: 100+ activity points
- **Silver Badge**: 300+ activity points
- **Gold Badge**: 500+ activity points
- **Excellence Badge**: Special achievements

### Real-time Notifications
Powered by Socket.IO for instant updates on:
- Activity approval/rejection
- Badge earned
- System announcements
- Reminders

---

## 📸 Screenshots

### Student Profile Dashboard
The profile page matches **exactly** with your provided image showing:
- Stats cards (Total Activities, Pending Approvals, Credits Earned)
- Student information section
- Attendance circle
- Academic records overview
- Co-curricular/Extra-curricular activity chart (bar chart)
- Skills & certifications section

---

## 🚀 Deployment

### Backend Deployment (Example: Heroku/Railway)

1. Create `.env` file with production values
2. Set MongoDB Atlas connection string
3. Deploy using:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Example: Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder

3. Update environment variables with production API URL

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Environment variable protection

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**MERN Developer**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

## 📧 Contact

For any queries or support, please reach out!

---

**Built with ❤️ using MERN Stack**
