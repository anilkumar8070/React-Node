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
  const [selectedFaculty, setSelectedFaculty] = useState(null);
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
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
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
                      setShowTimetableModal(true);
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
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl sticky top-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      Manage Timetable
                    </h2>
                    <button onClick={() => setShowTimetableModal(false)} className="text-white hover:bg-white/20 rounded-lg p-2">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-purple-100 mt-2">{selectedFaculty?.name}</p>
                </div>
                <div className="p-6">
                  <p className="text-center text-gray-600 py-8">
                    Timetable management interface - Faculty can manage their own timetable from their dashboard.
                    <br />
                    Admin can view and approve timetable changes here.
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowTimetableModal(false)}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FacultyManagement;
