import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Users, Edit, Trash2, DollarSign, Calendar, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

const FacultyManagement = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [editData, setEditData] = useState({
    section: ''
  });
  const [timetableData, setTimetableData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);
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
  const [salaryData, setSalaryData] = useState({
    basicSalary: '',
    allowances: '',
    deductions: ''
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculty(response.data.users.filter(u => u.role === 'faculty'));
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast.error('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleSalaryUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/users/${selectedFaculty._id}`,
        { 
          salary: {
            basic: parseFloat(salaryData.basicSalary),
            allowances: parseFloat(salaryData.allowances),
            deductions: parseFloat(salaryData.deductions)
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Salary updated successfully');
      setShowSalaryModal(false);
      fetchFaculty();
    } catch (error) {
      console.error('Error updating salary:', error);
      toast.error('Failed to update salary');
    }
  };

  const openSalaryModal = (fac) => {
    setSelectedFaculty(fac);
    setSalaryData({
      basicSalary: fac.salary?.basic || '',
      allowances: fac.salary?.allowances || '',
      deductions: fac.salary?.deductions || ''
    });
    setShowSalaryModal(true);
  };

  const openTimetableModal = async (fac) => {
    setSelectedFaculty(fac);
    setShowTimetableModal(true);
    setShowAddTimetable(false);
    await fetchFacultyTimetable(fac._id);
    await fetchClasses();
    await fetchAllFaculty();
    setNewTimetable({ ...newTimetable, faculty: fac._id });
  };

  const fetchFacultyTimetable = async (facultyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/timetable/faculty/${facultyId}`, {
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
      const response = await axios.get('/api/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchAllFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllFaculty(response.data.users.filter(u => u.role === 'faculty') || []);
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
        faculty: selectedFaculty._id,
        dayOfWeek: 'Monday',
        startTime: '',
        endTime: '',
        room: '',
        type: 'Lecture'
      });
      await fetchFacultyTimetable(selectedFaculty._id);
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
      await fetchFacultyTimetable(selectedFaculty._id);
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
      await fetchFacultyTimetable(selectedFaculty._id);
    } catch (error) {
      console.error('Error deleting timetable:', error);
      toast.error('Failed to delete timetable entry');
    }
  };

  const openEditModal = (fac) => {
    setSelectedFaculty(fac);
    setEditData({
      section: fac.section || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/users/${selectedFaculty._id}`,
        { section: editData.section },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Faculty section updated successfully');
      setShowEditModal(false);
      fetchFaculty();
    } catch (error) {
      console.error('Error updating faculty:', error);
      toast.error('Failed to update faculty');
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
              Faculty Management
            </h1>
            <p className="text-gray-600">Manage faculty members, salaries, and schedules</p>
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faculty.map((fac) => (
              <div key={fac._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{fac.name}</h3>
                      <p className="text-sm text-gray-600">{fac.email}</p>
                      <p className="text-sm text-blue-600 font-medium">{fac.designation}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Employee ID</p>
                    <p className="font-semibold text-gray-800">{fac.employeeId}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Specialization</p>
                    <p className="font-semibold text-gray-800">{fac.specialization || 'N/A'}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Assigned Section</p>
                    <p className="font-semibold text-purple-700">
                      {fac.section ? `Section ${fac.section}` : 'Not Assigned'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(fac)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Assign Section
                  </button>
                  <button
                    onClick={() => openSalaryModal(fac)}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Manage Salary
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFaculty(fac);
                      openTimetableModal(fac);
                    }}
                    className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Timetable
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Salary Modal */}
          {showSalaryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      Manage Salary
                    </h2>
                    <button onClick={() => setShowSalaryModal(false)} className="text-white hover:bg-white/20 rounded-lg p-2">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-green-100 mt-2">{selectedFaculty?.name}</p>
                </div>
                <form onSubmit={handleSalaryUpdate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Basic Salary (₹)</label>
                    <input
                      type="number"
                      value={salaryData.basicSalary}
                      onChange={(e) => setSalaryData({ ...salaryData, basicSalary: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="e.g., 50000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Allowances (₹)</label>
                    <input
                      type="number"
                      value={salaryData.allowances}
                      onChange={(e) => setSalaryData({ ...salaryData, allowances: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="e.g., 10000"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Deductions (₹)</label>
                    <input
                      type="number"
                      value={salaryData.deductions}
                      onChange={(e) => setSalaryData({ ...salaryData, deductions: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="e.g., 5000"
                    />
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">Net Salary:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{((parseFloat(salaryData.basicSalary) || 0) + (parseFloat(salaryData.allowances) || 0) - (parseFloat(salaryData.deductions) || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
                  >
                    Update Salary
                  </button>
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
                        Manage Faculty Timetable
                      </h2>
                      <p className="text-purple-100 mt-2">{selectedFaculty?.name} - {selectedFaculty?.designation}</p>
                    </div>
                    <button onClick={() => setShowTimetableModal(false)} className="text-white hover:bg-white/20 rounded-lg p-2">
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
                        <div className="col-span-2">
                          <label className="block text-gray-700 font-medium mb-2">Room</label>
                          <input
                            type="text"
                            value={newTimetable.room}
                            onChange={(e) => setNewTimetable({ ...newTimetable, room: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            placeholder="e.g., Room 301"
                          />
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
                                          <p className="text-sm text-gray-600">Class</p>
                                          <p className="font-semibold text-gray-800">{entry.class?.code || 'N/A'}</p>
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

          {/* Edit Section Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Assign Section</h2>
                  <p className="text-blue-100 mt-2">{selectedFaculty?.name}</p>
                </div>
                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Section</label>
                    <input
                      type="text"
                      value={editData.section}
                      onChange={(e) => setEditData({ ...editData, section: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., A, B, C"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">Assign this faculty to a specific section</p>
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

export default FacultyManagement;
