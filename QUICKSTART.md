# 🚀 Quick Start Guide

## Complete Installation Steps

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### Step 2: Setup MongoDB

**Option 1: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

### Step 3: Configure Environment Variables

**server/.env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/student_activity_platform
JWT_SECRET=student_activity_platform_secret_key_2025
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
CLIENT_URL=http://localhost:3000
```

**client/.env:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Server runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ Client runs on http://localhost:3000

### Step 5: Create Test Accounts

**Option 1: Use Signup Page**
- Go to http://localhost:3000/signup
- Fill in the form to create a student account

**Option 2: Create Admin via MongoDB**
```javascript
// Use MongoDB Compass or mongosh
db.users.insertOne({
  name: "Admin User",
  email: "admin@test.com",
  password: "$2a$10$X8p0I0yc1WwqAHV2LX2F0OUxKwGFdYGVR5xr8s8dDxH2MxC8v2V0e", // password123
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Step 6: Create Sample Department

```javascript
// Use MongoDB Compass or mongosh
db.departments.insertOne({
  name: "Computer Science",
  code: "CSE",
  description: "Department of Computer Science and Engineering",
  isActive: true,
  programs: [
    { name: "B.Tech CSE", duration: 4, type: "UG" },
    { name: "M.Tech CSE", duration: 2, type: "PG" }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 📋 Test the Application

### 1. Test Student Flow
1. **Signup** as a student at `/signup`
2. **Login** at `/login`
3. **View Profile** - You'll see the dashboard matching your image
4. **Add Activity** - Go to "Add Activity" and create a test activity
5. **View Activities** - Check your activity list
6. **Check Notifications** - You should see a notification

### 2. Test Faculty Flow
1. Create a faculty user (change role to 'faculty' in MongoDB)
2. Login as faculty
3. View students list
4. Review pending activities
5. Approve/Reject activities

### 3. Test Admin Flow
1. Login as admin (admin@test.com / password123)
2. View admin dashboard with analytics
3. Manage users
4. Manage departments
5. View system-wide reports

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
ps aux | grep mongo

# Start MongoDB
mongod --dbpath /path/to/your/data
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### CORS Error
- Make sure `CLIENT_URL` in `server/.env` matches your frontend URL
- Check that both servers are running

### Missing Dependencies
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Sample Data for Testing

### Create Sample Activities
```javascript
db.activities.insertMany([
  {
    student: ObjectId("your_student_id"),
    type: "certification",
    title: "AWS Cloud Practitioner",
    description: "Completed AWS Cloud Practitioner certification",
    category: "co-curricular",
    startDate: new Date("2024-01-15"),
    level: "international",
    achievementType: "certificate",
    status: "pending",
    createdAt: new Date()
  },
  {
    student: ObjectId("your_student_id"),
    type: "internship",
    title: "Software Development Intern at TechCorp",
    description: "Worked on full-stack development projects",
    category: "curricular",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-08-31"),
    duration: 90,
    level: "national",
    achievementType: "certificate",
    status: "approved",
    score: 45,
    credits: 6,
    createdAt: new Date()
  }
])
```

## 🎯 Features to Test

### Student Features
- ✅ Profile page with exact design from your image
- ✅ Add activities with file uploads
- ✅ View activity list with filtering
- ✅ Edit/Delete pending activities
- ✅ View activity details
- ✅ Check real-time notifications
- ✅ View badges and scores
- ✅ Generate PDF reports

### Faculty Features
- ✅ Dashboard with statistics
- ✅ Students list view
- ✅ Activity review interface
- ✅ Approve/Reject with remarks
- ✅ Track student progress

### Admin Features
- ✅ Admin dashboard with charts
- ✅ User management (CRUD)
- ✅ Department management
- ✅ System analytics
- ✅ Export reports

## 📱 Default Test Credentials

Once you create users, use these for testing:

**Student:**
- Email: student@test.com
- Password: password123

**Faculty:**
- Email: faculty@test.com
- Password: password123

**Admin:**
- Email: admin@test.com
- Password: password123

## 🎨 Customization

### Change Theme Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change these values
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
}
```

### Change Logo
Replace the logo in `client/src/components/Layout.jsx`

### Add More Activity Types
Edit `server/models/Activity.js` enum values

## 📚 Next Steps

1. ✅ Test all features thoroughly
2. ✅ Customize design to match your brand
3. ✅ Add more sample data
4. ✅ Deploy to production
5. ✅ Add more features as needed

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints in README.md
- Check console for error messages
- Ensure all dependencies are installed

---

**🎉 You're all set! Happy coding!**
