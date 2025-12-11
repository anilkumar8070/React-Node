const Class = require('../models/Class');
const User = require('../models/User');

const seedClasses = async () => {
  try {
    const count = await Class.countDocuments();
    
    // Only seed if no classes exist
    if (count === 0) {
      // Find a faculty user (you can create one if needed)
      const faculty = await User.findOne({ role: 'faculty' });
      
      if (!faculty) {
        console.log('⚠️  No faculty found. Please create a faculty user first.');
        return;
      }

      // Find students
      const students = await User.find({ role: 'student' }).limit(30);
      
      if (students.length === 0) {
        console.log('⚠️  No students found. Please create student users first.');
        return;
      }

      // Create sample classes
      const classes = [
        {
          code: 'K23DT',
          name: 'Data Science & Analytics',
          faculty: faculty._id,
          department: faculty.department,
          semester: '5',
          academicYear: '2024-25',
          subject: 'Data Science',
          students: students.slice(0, 10).map(s => s._id),
          totalLectures: 15,
          isActive: true
        },
        {
          code: 'K23GX',
          name: 'Advanced Web Technologies',
          faculty: faculty._id,
          department: faculty.department,
          semester: '6',
          academicYear: '2024-25',
          subject: 'Web Development',
          students: students.slice(5, 15).map(s => s._id),
          totalLectures: 12,
          isActive: true
        },
        {
          code: 'K24AV',
          name: 'Machine Learning',
          faculty: faculty._id,
          department: faculty.department,
          semester: '7',
          academicYear: '2024-25',
          subject: 'Artificial Intelligence',
          students: students.slice(10, 20).map(s => s._id),
          totalLectures: 18,
          isActive: true
        },
        {
          code: 'K24BX',
          name: 'Cloud Computing',
          faculty: faculty._id,
          department: faculty.department,
          semester: '5',
          academicYear: '2024-25',
          subject: 'Cloud Technologies',
          students: students.slice(15, 25).map(s => s._id),
          totalLectures: 10,
          isActive: true
        },
        {
          code: 'K23YZ',
          name: 'Cyber Security Fundamentals',
          faculty: faculty._id,
          department: faculty.department,
          semester: '6',
          academicYear: '2024-25',
          subject: 'Cyber Security',
          students: students.slice(0, 12).map(s => s._id),
          totalLectures: 14,
          isActive: true
        }
      ];

      await Class.insertMany(classes);
      console.log('✅ Sample classes seeded successfully');
    } else {
      console.log('📊 Classes already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding classes:', error.message);
  }
};

module.exports = seedClasses;
