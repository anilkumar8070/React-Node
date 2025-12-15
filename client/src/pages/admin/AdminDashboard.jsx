import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import Chatbot from '../../components/Chatbot';
import axios from 'axios';
import { Users, BookOpen, Activity, BarChart3, UserCheck, Award, TrendingUp, Settings, Shield, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalActivities: 0,
    pendingApprovals: 0,
    totalClasses: 0,
    totalDepartments: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated in session
    const adminAuth = sessionStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '963963963') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      toast.success('Access Granted!');
      fetchDashboardData();
    } else {
      toast.error('Invalid Password!');
      setPassword('');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, activitiesRes, classesRes, deptRes] = await Promise.all([
        axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/activities', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/classes/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/departments', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const users = usersRes.data.users || [];
      const activities = activitiesRes.data.activities || [];
      
      setStats({
        totalStudents: users.filter(u => u.role === 'student').length,
        totalFaculty: users.filter(u => u.role === 'faculty').length,
        totalActivities: activities.length,
        pendingApprovals: activities.filter(a => a.status === 'pending').length,
        totalClasses: classesRes.data.classes?.length || 0,
        totalDepartments: deptRes.data.departments?.length || 0
      });

      // Get recent activities
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    setPassword('');
    toast.info('Admin session ended');
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h1>
              <p className="text-gray-600">Enter the admin password to continue</p>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
              >
                Unlock Dashboard
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Protected by secure authentication</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const statsCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-500', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
    { title: 'Total Faculty', value: stats.totalFaculty, icon: UserCheck, color: 'bg-green-500', bgLight: 'bg-green-50', textColor: 'text-green-600' },
    { title: 'Total Activities', value: stats.totalActivities, icon: Activity, color: 'bg-purple-500', bgLight: 'bg-purple-50', textColor: 'text-purple-600' },
    { title: 'Pending Approvals', value: stats.pendingApprovals, icon: FileText, color: 'bg-orange-500', bgLight: 'bg-orange-50', textColor: 'text-orange-600' },
    { title: 'Total Classes', value: stats.totalClasses, icon: BookOpen, color: 'bg-teal-500', bgLight: 'bg-teal-50', textColor: 'text-teal-600' },
    { title: 'Departments', value: stats.totalDepartments, icon: Award, color: 'bg-pink-500', bgLight: 'bg-pink-50', textColor: 'text-pink-600' }
  ];

  const chartData = [
    { name: 'Students', value: stats.totalStudents },
    { name: 'Faculty', value: stats.totalFaculty },
    { name: 'Classes', value: stats.totalClasses }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-blue-600" />
                Admin Control Panel
              </h1>
              <p className="text-gray-600">Complete control and overview of the platform</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg"
            >
              Lock Dashboard
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                    </div>
                    <div className={`${card.bgLight} p-4 rounded-xl`}>
                      <Icon className={`w-8 h-8 ${card.textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Platform Overview
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 font-semibold py-4 px-6 rounded-lg transition flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    Manage Users
                  </span>
                  <span className="text-sm">{stats.totalStudents + stats.totalFaculty} Total</span>
                </button>
                <button
                  onClick={() => navigate('/admin/faculty')}
                  className="w-full bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 font-semibold py-4 px-6 rounded-lg transition flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5" />
                    Faculty Management
                  </span>
                  <span className="text-sm">Salary & Timetable</span>
                </button>
                <button
                  onClick={() => navigate('/admin/students')}
                  className="w-full bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 font-semibold py-4 px-6 rounded-lg transition flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    Student Management
                  </span>
                  <span className="text-sm">{stats.totalStudents} Students</span>
                </button>
                <button
                  onClick={() => navigate('/admin/meetings')}
                  className="w-full bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 text-pink-700 font-semibold py-4 px-6 rounded-lg transition flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    Schedule Meetings
                  </span>
                  <span className="text-sm">Faculty & Students</span>
                </button>
                <button
                  onClick={() => navigate('/admin/departments')}
                  className="w-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 font-semibold py-4 px-6 rounded-lg transition flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-3">
                    <Award className="w-5 h-5" />
                    Manage Departments
                  </span>
                  <span className="text-sm">{stats.totalDepartments} Departments</span>
                </button>
                <button
                  onClick={() => navigate('/faculty/review')}
                  className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 font-semibold py-4 px-6 rounded-lg transition flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    Review Activities
                  </span>
                  <span className="text-sm">{stats.pendingApprovals} Pending</span>
                </button>
                <button
                  onClick={() => navigate('/reports')}
                  className="w-full bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 font-semibold py-4 px-6 rounded-lg transition flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5" />
                    Generate Reports
                  </span>
                  <span className="text-sm">View Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-1">Platform Status</p>
                <p className="text-2xl font-bold">🟢 Online</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalStudents + stats.totalFaculty + 1}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Last Updated</p>
                <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default AdminDashboard;
