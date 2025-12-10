const Department = require('../models/Department');

const seedDepartments = async () => {
  try {
    const count = await Department.countDocuments();
    
    // Only seed if no departments exist
    if (count === 0) {
      const departments = [
        {
          name: 'Computer Science and Engineering',
          code: 'CSE',
          description: 'Department of Computer Science and Engineering',
          programs: [
            { name: 'B.Tech CSE', duration: 4, type: 'UG' },
            { name: 'M.Tech CSE', duration: 2, type: 'PG' }
          ],
          isActive: true
        },
        {
          name: 'Electronics and Communication Engineering',
          code: 'ECE',
          description: 'Department of Electronics and Communication Engineering',
          programs: [
            { name: 'B.Tech ECE', duration: 4, type: 'UG' },
            { name: 'M.Tech ECE', duration: 2, type: 'PG' }
          ],
          isActive: true
        },
        {
          name: 'Mechanical Engineering',
          code: 'ME',
          description: 'Department of Mechanical Engineering',
          programs: [
            { name: 'B.Tech ME', duration: 4, type: 'UG' },
            { name: 'M.Tech ME', duration: 2, type: 'PG' }
          ],
          isActive: true
        },
        {
          name: 'Civil Engineering',
          code: 'CE',
          description: 'Department of Civil Engineering',
          programs: [
            { name: 'B.Tech CE', duration: 4, type: 'UG' },
            { name: 'M.Tech CE', duration: 2, type: 'PG' }
          ],
          isActive: true
        },
        {
          name: 'Electrical and Electronics Engineering',
          code: 'EEE',
          description: 'Department of Electrical and Electronics Engineering',
          programs: [
            { name: 'B.Tech EEE', duration: 4, type: 'UG' },
            { name: 'M.Tech EEE', duration: 2, type: 'PG' }
          ],
          isActive: true
        },
        {
          name: 'Information Technology',
          code: 'IT',
          description: 'Department of Information Technology',
          programs: [
            { name: 'B.Tech IT', duration: 4, type: 'UG' },
            { name: 'M.Tech IT', duration: 2, type: 'PG' }
          ],
          isActive: true
        },
        {
          name: 'Artificial Intelligence and Data Science',
          code: 'AIDS',
          description: 'Department of Artificial Intelligence and Data Science',
          programs: [
            { name: 'B.Tech AI&DS', duration: 4, type: 'UG' },
            { name: 'M.Tech AI&DS', duration: 2, type: 'PG' }
          ],
          isActive: true
        }
      ];

      await Department.insertMany(departments);
      console.log('✅ Sample departments seeded successfully');
    } else {
      console.log('📊 Departments already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding departments:', error.message);
  }
};

module.exports = seedDepartments;
