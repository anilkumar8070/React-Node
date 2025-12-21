const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const User = require('../models/User');

const migrateAccountStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update admin and faculty users to be approved
    const adminFacultyResult = await User.updateMany(
      { 
        role: { $in: ['admin', 'faculty'] },
        $or: [
          { accountStatus: { $exists: false } },
          { accountStatus: null },
          { accountStatus: 'pending' }
        ]
      },
      { 
        $set: { accountStatus: 'approved' }
      }
    );
    console.log(`Admin/Faculty migration: ${adminFacultyResult.modifiedCount} users set to approved`);

    // Update student users without accountStatus to pending
    const studentResult = await User.updateMany(
      { 
        role: 'student',
        $or: [
          { accountStatus: { $exists: false } },
          { accountStatus: null }
        ]
      },
      { 
        $set: { accountStatus: 'pending' }
      }
    );
    console.log(`Student migration: ${studentResult.modifiedCount} students set to pending`);

    // Display all users with their status
    const users = await User.find({}).select('name email role accountStatus');
    console.log('\nCurrent users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}, Status: ${user.accountStatus || 'undefined'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateAccountStatus();
