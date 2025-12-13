import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Download, TrendingUp, Users, Award, Activity, 
  Calendar, Filter, FileText, Printer 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ReportsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    overview: {},
    activityTrends: [],
    departmentStats: [],
    topPerformers: [],
    categoryBreakdown: []
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    activityType: ''
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchReportData();
    if (user?.role === 'admin') {
      fetchDepartments();
    }
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '/api/reports';
      
      if (user?.role === 'admin') {
        endpoint = '/api/admin/dashboard';
      } else if (user?.role === 'faculty') {
        endpoint = '/api/faculty/dashboard';
      } else {
        endpoint = '/api/activities/stats';
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Format data for charts
      const data = response.data;
      setReportData({
        overview: {
          totalActivities: data.totalActivities || data.stats?.totalActivities || 0,
          approvedActivities: data.approvedActivities || data.stats?.approvedActivities || 0,
          activeParticipants: data.totalStudents || data.stats?.participationCount || 0,
          thisMonth: data.thisMonth || 0
        },
        activityTrends: data.activityTrends || [],
        departmentStats: data.departmentStats || [],
        topPerformers: data.topStudents || [],
        categoryBreakdown: data.activityTypeStats || []
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    setLoading(true);
    fetchReportData();
  };

  const exportReport = (format) => {
    toast.info(`Export functionality for ${format.toUpperCase()} coming soon!`);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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
              <FileText className="w-10 h-10 text-blue-600" />
              Analytics & Reports
            </h1>
            <p className="text-gray-600">Comprehensive insights and data analysis</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              {user?.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Export Report</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => exportReport('pdf')}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => exportReport('excel')}
                  className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-blue-100 text-sm mb-1">Total Activities</p>
              <p className="text-3xl font-bold">{reportData.overview?.totalActivities || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-green-100 text-sm mb-1">Approved Activities</p>
              <p className="text-3xl font-bold">{reportData.overview?.approvedActivities || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-purple-100 text-sm mb-1">Active Participants</p>
              <p className="text-3xl font-bold">{reportData.overview?.activeParticipants || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-orange-100 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold">{reportData.overview?.thisMonth || 0}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Activity Trends */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Activity Trends</h3>
              {reportData.activityTrends?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.activityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No trend data available
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown</h3>
              {reportData.categoryBreakdown?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No category data available
                </div>
              )}
            </div>
          </div>

          {/* Department Comparison */}
          {user?.role === 'admin' && reportData.departmentStats?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Department-wise Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#3B82F6" name="Students" />
                  <Bar dataKey="activities" fill="#10B981" name="Activities" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Performers */}
          {reportData.topPerformers?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Performers</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll No</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">CGPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topPerformers.map((student, index) => (
                      <tr key={student._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                            'bg-gradient-to-br from-blue-400 to-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.rollNo || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-blue-600">{student.activityScore || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-green-600">{student.cgpa?.toFixed(2) || 'N/A'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
