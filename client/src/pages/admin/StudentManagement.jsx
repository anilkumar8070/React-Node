import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Users, Edit, Trash2, Award, BookOpen, TrendingUp, Search, Calendar, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showAddTimetable, setShowAddTimetable] = useState(false);
  const [newTimetable, setNewTimetable] = useState({
    class: '',
    subject: '',
    faculty: '',
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    room: '',
    type: 'Lecture'
  });
  const [editingTimetable, setEditingTimetable] = useState(null);
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

  const openTimetableModal = async (student) => {
    setSelectedStudent(student);
    setShowTimetableModal(true);
    setShowAddTimetable(false);
    await fetchStudentTimetable(student._id);
    await fetchClasses();
    await fetchFaculty();
  };

  const fetchStudentTimetable = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/timetable/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimetableData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast.error('Failed to load timetable');
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/classes/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculty(response.data.users.filter(u => u.role === 'faculty') || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const handleAddTimetable = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/timetable',
        newTimetable,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Timetable entry added successfully');
      setShowAddTimetable(false);
      setNewTimetable({
        class: '',
        subject: '',
        faculty: '',
        dayOfWeek: 'Monday',
        startTime: '',
        endTime: '',
        room: '',
        type: 'Lecture'
      });
      await fetchStudentTimetable(selectedStudent._id);
    } catch (error) {
      console.error('Error adding timetable:', error);
      toast.error(error.response?.data?.message || 'Failed to add timetable entry');
    }
  };

  const handleUpdateTimetable = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/timetable/${editingTimetable._id}`,
        editingTimetable,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Timetable entry updated successfully');
      setEditingTimetable(null);
      await fetchStudentTimetable(selectedStudent._id);
    } catch (error) {
      console.error('Error updating timetable:', error);
      toast.error(error.response?.data?.message || 'Failed to update timetable entry');
    }
  };

  const handleDeleteTimetable = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timetable entry?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/timetable/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Timetable entry deleted successfully');
      await fetchStudentTimetable(selectedStudent._id);
    } catch (error) {
      console.error('Error deleting timetable:', error);
      toast.error('Failed to delete timetable entry');
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition"
                            title="Edit Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openTimetableModal(student)}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-600 p-2 rounded-lg transition"
                            title="Manage Timetable"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
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

          {/* Timetable Modal */}
          {showTimetableModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Manage Student Timetable
                      </h2>
                      <p className="text-purple-100 mt-2">{selectedStudent?.name} - {selectedStudent?.rollNo}</p>
                    </div>
                    <button 
                      onClick={() => setShowTimetableModal(false)} 
                      className="text-white hover:bg-white/20 rounded-lg p-2"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Weekly Schedule</h3>
                    <button
                      onClick={() => setShowAddTimetable(!showAddTimetable)}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Entry
                    </button>
                  </div>

                  {/* Add Timetable Form */}
                  {showAddTimetable && (
                    <div className="bg-purple-50 rounded-xl p-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Timetable Entry</h4>
                      <form onSubmit={handleAddTimetable} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Class</label>
                          <select
                            value={newTimetable.class}
                            onChange={(e) => setNewTimetable({ ...newTimetable, class: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            required
                          >
                            <option value="">Select Class</option>
                            {classes.map(cls => (
                              <option key={cls._id} value={cls._id}>{cls.code} - {cls.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Subject</label>
                          <input
                            type="text"
                            value={newTimetable.subject}
                            onChange={(e) => setNewTimetable({ ...newTimetable, subject: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            placeholder="e.g., Mathematics"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Faculty</label>
                          <select
                            value={newTimetable.faculty}
                            onChange={(e) => setNewTimetable({ ...newTimetable, faculty: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            required
                          >
                            <option value="">Select Faculty</option>
                            {faculty.map(fac => (
                              <option key={fac._id} value={fac._id}>{fac.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Day</label>
                          <select
                            value={newTimetable.dayOfWeek}
                            onChange={(e) => setNewTimetable({ ...newTimetable, dayOfWeek: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            required
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                          <input
                            type="time"
                            value={newTimetable.startTime}
                            onChange={(e) => setNewTimetable({ ...newTimetable, startTime: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">End Time</label>
                          <input
                            type="time"
                            value={newTimetable.endTime}
                            onChange={(e) => setNewTimetable({ ...newTimetable, endTime: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Room</label>
                          <input
                            type="text"
                            value={newTimetable.room}
                            onChange={(e) => setNewTimetable({ ...newTimetable, room: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            placeholder="e.g., Room 301"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Type</label>
                          <select
                            value={newTimetable.type}
                            onChange={(e) => setNewTimetable({ ...newTimetable, type: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                          >
                            <option value="Lecture">Lecture</option>
                            <option value="Tutorial">Tutorial</option>
                            <option value="Lab">Lab</option>
                            <option value="Practical">Practical</option>
                          </select>
                        </div>
                        <div className="col-span-2 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowAddTimetable(false)}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                          >
                            Add Entry
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Timetable Display */}
                  {timetableData.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">No timetable entries found</p>
                      <p className="text-sm">Click "Add Entry" to create a new timetable entry</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                        const dayEntries = timetableData.filter(entry => entry.dayOfWeek === day);
                        if (dayEntries.length === 0) return null;
                        
                        return (
                          <div key={day} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                            <div className="bg-purple-600 text-white px-6 py-3">
                              <h4 className="text-lg font-bold">{day}</h4>
                            </div>
                            <div className="divide-y divide-gray-200">
                              {dayEntries.map(entry => (
                                <div key={entry._id}>
                                  {editingTimetable && editingTimetable._id === entry._id ? (
                                    <form onSubmit={handleUpdateTimetable} className="p-4 bg-purple-50">
                                      <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div>
                                          <label className="block text-gray-700 font-medium mb-1 text-sm">Subject</label>
                                          <input
                                            type="text"
                                            value={editingTimetable.subject}
                                            onChange={(e) => setEditingTimetable({ ...editingTimetable, subject: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-gray-700 font-medium mb-1 text-sm">Start Time</label>
                                          <input
                                            type="time"
                                            value={editingTimetable.startTime}
                                            onChange={(e) => setEditingTimetable({ ...editingTimetable, startTime: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-gray-700 font-medium mb-1 text-sm">End Time</label>
                                          <input
                                            type="time"
                                            value={editingTimetable.endTime}
                                            onChange={(e) => setEditingTimetable({ ...editingTimetable, endTime: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-gray-700 font-medium mb-1 text-sm">Room</label>
                                          <input
                                            type="text"
                                            value={editingTimetable.room}
                                            onChange={(e) => setEditingTimetable({ ...editingTimetable, room: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-gray-700 font-medium mb-1 text-sm">Type</label>
                                          <select
                                            value={editingTimetable.type}
                                            onChange={(e) => setEditingTimetable({ ...editingTimetable, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                          >
                                            <option value="Lecture">Lecture</option>
                                            <option value="Tutorial">Tutorial</option>
                                            <option value="Lab">Lab</option>
                                            <option value="Practical">Practical</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setEditingTimetable(null)}
                                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </form>
                                  ) : (
                                    <div className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                      <div className="flex-1 grid grid-cols-4 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-600">Subject</p>
                                          <p className="font-semibold text-gray-800">{entry.subject}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-600">Time</p>
                                          <p className="font-semibold text-gray-800">{entry.startTime} - {entry.endTime}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-600">Faculty</p>
                                          <p className="font-semibold text-gray-800">{entry.faculty?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-600">Room / Type</p>
                                          <p className="font-semibold text-gray-800">{entry.room || 'N/A'} / {entry.type}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 ml-4">
                                        <button
                                          onClick={() => setEditingTimetable(entry)}
                                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTimetable(entry._id)}
                                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentManagement;
