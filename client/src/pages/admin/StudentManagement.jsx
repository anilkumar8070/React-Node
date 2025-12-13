import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Users, Edit, Trash2, Award, BookOpen, TrendingUp, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    cgpa: '',
    semester: '',
    section: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const studentData = response.data.users.filter(u => u.role === 'student');
      setStudents(studentData);
      setFilteredStudents(studentData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditData({
      cgpa: student.cgpa || '',
      semester: student.semester || '',
      section: student.section || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/users/${selectedStudent._id}`,
        { 
          cgpa: parseFloat(editData.cgpa),
          semester: editData.semester,
          section: editData.section
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Student updated successfully');
      setShowEditModal(false);
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Users className="w-10 h-10 text-blue-600" />
              Student Management
            </h1>
            <p className="text-gray-600">Manage student records, CGPA, and academic details</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-gray-800">{students.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Avg CGPA</p>
                  <p className="text-3xl font-bold text-green-600">
                    {(students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length || 0).toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Active Programs</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {[...new Set(students.map(s => s.program))].filter(Boolean).length}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Credits</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {students.reduce((sum, s) => sum + (s.totalCredits || 0), 0)}
                  </p>
                </div>
                <Award className="w-12 h-12 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Roll No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Program</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Semester</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">CGPA</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Credits</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student._id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{student.rollNo || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-600">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{student.program || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{student.semester || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${
                          (student.cgpa || 0) >= 8 ? 'text-green-600' :
                          (student.cgpa || 0) >= 6 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {student.cgpa?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{student.totalCredits || 0}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(student)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Edit Student Details</h2>
                  <p className="text-blue-100 mt-2">{selectedStudent?.name}</p>
                </div>
                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={editData.cgpa}
                      onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 8.50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Semester</label>
                    <input
                      type="text"
                      value={editData.semester}
                      onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Section</label>
                    <input
                      type="text"
                      value={editData.section}
                      onChange={(e) => setEditData({ ...editData, section: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., A"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentManagement;
