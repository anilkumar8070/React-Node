import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Chatbot from '../../components/Chatbot';
import { getMe } from '../../redux/slices/authSlice';
import axios from 'axios';
import { 
  Users, 
  ClipboardCheck, 
  Clock, 
  BookOpen, 
  Calendar,
  GraduationCap,
  FileText,
  TrendingUp,
  User,
  Mail,
  Phone,
  Building2,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const FacultyDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    dispatch(getMe());
    fetchDashboardStats();
    fetchMyClasses();
  }, [dispatch]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/faculty/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/classes/my-classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Sample data for charts
  const monthlyActivities = [
    { month: 'Jan', approved: 12, pending: 5, rejected: 2 },
    { month: 'Feb', approved: 18, pending: 7, rejected: 3 },
    { month: 'Mar', approved: 15, pending: 9, rejected: 1 },
    { month: 'Apr', approved: 22, pending: 6, rejected: 2 },
    { month: 'May', approved: 20, pending: 8, rejected: 4 },
    { month: 'Jun', approved: 25, pending: 10, rejected: 2 },
  ];

  const activityTypeData = [
    { name: 'Workshops', value: 35 },
    { name: 'Certifications', value: 28 },
    { name: 'Internships', value: 20 },
    { name: 'Projects', value: 17 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-blue-100">Faculty Dashboard - {user?.department?.name || 'Department'}</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-blue-100">Employee ID</p>
                  <p className="text-lg font-semibold">{user?.employeeId || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Faculty Profile
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="text-gray-800 font-medium">{user?.designation || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  <p className="text-gray-800 font-medium">{user?.qualification || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Specialization</p>
                  <p className="text-gray-800 font-medium">{user?.specialization || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-gray-800 font-medium">{user?.department?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">{user?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800 font-medium">{user?.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Assigned Section</p>
                  <p className="text-gray-800 font-medium">
                    {user?.section ? (
                      <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                        Section {user.section}
                      </span>
                    ) : (
                      'Not Assigned'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Students</h3>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalStudents || 45}</p>
              <p className="text-sm text-gray-500 mt-2">Under mentorship</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Reviews</h3>
              <p className="text-3xl font-bold text-gray-800">{stats?.pendingActivities || 12}</p>
              <p className="text-sm text-gray-500 mt-2">Awaiting approval</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Approved This Month</h3>
              <p className="text-3xl font-bold text-gray-800">{stats?.approvedThisMonth || 25}</p>
              <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Activities</h3>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalActivities || 156}</p>
              <p className="text-sm text-gray-500 mt-2">Reviewed overall</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Activities Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Activity Reviews</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyActivities}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Type Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/faculty/review')}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <ClipboardCheck className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800 group-hover:text-blue-600">Review Activities</p>
                  <p className="text-sm text-gray-500">Approve or reject student activities</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/faculty/students')}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <Users className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800 group-hover:text-green-600">View Students</p>
                  <p className="text-sm text-gray-500">See all mentored students</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/reports')}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <FileText className="w-8 h-8 text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800 group-hover:text-purple-600">Generate Reports</p>
                  <p className="text-sm text-gray-500">Create student activity reports</p>
                </div>
              </button>
            </div>
          </div>

          {/* Weekly Timetable Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Weekly Schedule
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">Time</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Monday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Tuesday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Wednesday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Thursday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Friday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Saturday</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 8:00 - 9:00 */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">8:00 - 9:00</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-blue-100 rounded-lg p-3 text-center hover:bg-blue-200 transition cursor-pointer">
                        <p className="font-semibold text-blue-800 text-sm">K23DT</p>
                        <p className="text-xs text-blue-600">Data Science</p>
                        <p className="text-xs text-gray-600 mt-1">Room 301</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-purple-100 rounded-lg p-3 text-center hover:bg-purple-200 transition cursor-pointer">
                        <p className="font-semibold text-purple-800 text-sm">K24AV</p>
                        <p className="text-xs text-purple-600">Machine Learning</p>
                        <p className="text-xs text-gray-600 mt-1">Lab 2</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-teal-100 rounded-lg p-3 text-center hover:bg-teal-200 transition cursor-pointer">
                        <p className="font-semibold text-teal-800 text-sm">K23YZ</p>
                        <p className="text-xs text-teal-600">Cyber Security</p>
                        <p className="text-xs text-gray-600 mt-1">Room 401</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-blue-100 rounded-lg p-3 text-center hover:bg-blue-200 transition cursor-pointer">
                        <p className="font-semibold text-blue-800 text-sm">K23DT</p>
                        <p className="text-xs text-blue-600">Data Science</p>
                        <p className="text-xs text-gray-600 mt-1">Room 301</p>
                      </div>
                    </td>
                  </tr>

                  {/* 9:00 - 10:00 */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">9:00 - 10:00</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-green-100 rounded-lg p-3 text-center hover:bg-green-200 transition cursor-pointer">
                        <p className="font-semibold text-green-800 text-sm">K23GX</p>
                        <p className="text-xs text-green-600">Web Technologies</p>
                        <p className="text-xs text-gray-600 mt-1">Room 205</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-purple-100 rounded-lg p-3 text-center hover:bg-purple-200 transition cursor-pointer">
                        <p className="font-semibold text-purple-800 text-sm">K24AV</p>
                        <p className="text-xs text-purple-600">Machine Learning</p>
                        <p className="text-xs text-gray-600 mt-1">Lab 2</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-teal-100 rounded-lg p-3 text-center hover:bg-teal-200 transition cursor-pointer">
                        <p className="font-semibold text-teal-800 text-sm">K23YZ</p>
                        <p className="text-xs text-teal-600">Cyber Security</p>
                        <p className="text-xs text-gray-600 mt-1">Room 401</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-orange-100 rounded-lg p-3 text-center hover:bg-orange-200 transition cursor-pointer">
                        <p className="font-semibold text-orange-800 text-sm">K24BX</p>
                        <p className="text-xs text-orange-600">Cloud Computing</p>
                        <p className="text-xs text-gray-600 mt-1">Lab 1</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-green-100 rounded-lg p-3 text-center hover:bg-green-200 transition cursor-pointer">
                        <p className="font-semibold text-green-800 text-sm">K23GX</p>
                        <p className="text-xs text-green-600">Web Technologies</p>
                        <p className="text-xs text-gray-600 mt-1">Room 205</p>
                      </div>
                    </td>
                  </tr>

                  {/* 10:00 - 11:00 */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">10:00 - 11:00</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-purple-100 rounded-lg p-3 text-center hover:bg-purple-200 transition cursor-pointer">
                        <p className="font-semibold text-purple-800 text-sm">K24AV</p>
                        <p className="text-xs text-purple-600">Machine Learning</p>
                        <p className="text-xs text-gray-600 mt-1">Lab 2</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-blue-100 rounded-lg p-3 text-center hover:bg-blue-200 transition cursor-pointer">
                        <p className="font-semibold text-blue-800 text-sm">K23DT</p>
                        <p className="text-xs text-blue-600">Data Science</p>
                        <p className="text-xs text-gray-600 mt-1">Room 301</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-green-100 rounded-lg p-3 text-center hover:bg-green-200 transition cursor-pointer">
                        <p className="font-semibold text-green-800 text-sm">K23GX</p>
                        <p className="text-xs text-green-600">Web Technologies</p>
                        <p className="text-xs text-gray-600 mt-1">Room 205</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-teal-100 rounded-lg p-3 text-center hover:bg-teal-200 transition cursor-pointer">
                        <p className="font-semibold text-teal-800 text-sm">K23YZ</p>
                        <p className="text-xs text-teal-600">Cyber Security</p>
                        <p className="text-xs text-gray-600 mt-1">Room 401</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-purple-100 rounded-lg p-3 text-center hover:bg-purple-200 transition cursor-pointer">
                        <p className="font-semibold text-purple-800 text-sm">K24AV</p>
                        <p className="text-xs text-purple-600">Machine Learning</p>
                        <p className="text-xs text-gray-600 mt-1">Lab 2</p>
                      </div>
                    </td>
                  </tr>

                  {/* 11:00 - 12:00 */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">11:00 - 12:00</td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-orange-100 rounded-lg p-3 text-center hover:bg-orange-200 transition cursor-pointer">
                        <p className="font-semibold text-orange-800 text-sm">K24BX</p>
                        <p className="text-xs text-orange-600">Cloud Computing</p>
                        <p className="text-xs text-gray-600 mt-1">Lab 1</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-green-100 rounded-lg p-3 text-center hover:bg-green-200 transition cursor-pointer">
                        <p className="font-semibold text-green-800 text-sm">K23GX</p>
                        <p className="text-xs text-green-600">Web Technologies</p>
                        <p className="text-xs text-gray-600 mt-1">Room 205</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-teal-100 rounded-lg p-3 text-center hover:bg-teal-200 transition cursor-pointer">
                        <p className="font-semibold text-teal-800 text-sm">K23YZ</p>
                        <p className="text-xs text-teal-600">Cyber Security</p>
                        <p className="text-xs text-gray-600 mt-1">Room 401</p>
                      </div>
                    </td>
                  </tr>

                  {/* 12:00 - 1:00 - LUNCH BREAK */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">12:00 - 1:00</td>
                    <td colSpan="6" className="border border-gray-300 px-4 py-3 bg-yellow-50">
                      <p className="text-center font-semibold text-gray-700">🍽️ LUNCH BREAK</p>
                    </td>
                  </tr>

                  {/* 1:00 - 2:00 */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">1:00 - 2:00</td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-orange-100 rounded-lg p-3 text-center hover:bg-orange-200 transition cursor-pointer">
                        <p className="font-semibold text-orange-800 text-sm">K24BX</p>
                        <p className="text-xs text-orange-600">Cloud Computing</p>
                        <p className="text-xs text-gray-600 mt-1">Lab 1</p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="bg-orange-100 rounded-lg p-3 text-center hover:bg-orange-200 transition cursor-pointer">
                        <p className="font-semibold text-orange-800 text-sm">K24BX</p>
                        <p className="text-xs text-orange-600">Cloud Computing</p>
                        <p className="text-xs text-gray-600 mt-1">Lab 1</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-end gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span>Theory</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
                <span>Lab</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-100 border border-pink-300 rounded"></div>
                <span>Office Hours</span>
              </div>
            </div>
          </div>

          {/* Assigned Classes Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                My Assigned Classes
              </h3>
              <span className="text-sm text-gray-500">{classes.length} Classes</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((classItem) => (
                <div
                  key={classItem._id}
                  onClick={() => navigate(`/faculty/class/${classItem._id}`)}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {classItem.code.substring(0, 2)}
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Sem {classItem.semester}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {classItem.code}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{classItem.name}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{classItem.totalStudents} Students</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{classItem.totalLectures} Lectures</span>
                    </div>
                  </div>
                </div>
              ))}
              {classes.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No classes assigned yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Activity Submissions</h3>
              <button
                onClick={() => navigate('/faculty/review')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Activity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">Rahul Kumar</td>
                    <td className="px-4 py-3 text-sm text-gray-800">AWS Cloud Certification</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Certification</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Dec 10, 2025</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">Priya Sharma</td>
                    <td className="px-4 py-3 text-sm text-gray-800">Web Development Internship</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Internship</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Dec 09, 2025</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">Amit Patel</td>
                    <td className="px-4 py-3 text-sm text-gray-800">Hackathon Winner</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Competition</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Dec 08, 2025</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default FacultyDashboard;
