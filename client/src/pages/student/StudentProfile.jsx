import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, FileText, BookOpen, Award, Settings, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getMe } from '../../redux/slices/authSlice';
import { getActivityStats } from '../../redux/slices/activitySlice';
import Layout from '../../components/Layout';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const StudentProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.activities);

  useEffect(() => {
    dispatch(getMe());
    dispatch(getActivityStats());
  }, [dispatch]);

  // Prepare chart data
  const activityChartData = stats?.byCategory
    ? Object.entries(stats.byCategory).map(([name, value]) => ({
        name: name.replace('-', ' ').toUpperCase(),
        value,
      }))
    : [];

  const monthlyActivityData = stats?.monthlyActivities
    ? stats.monthlyActivities.map((item) => ({
        month: `${item._id.month}/${item._id.year}`,
        activities: item.count,
      }))
    : [];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-2xl font-bold text-gray-600">
                  LOGO
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">Platform Name</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">{user?.name || 'Student Name'}</span>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <nav className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md">
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md">
                    <FileText className="w-5 h-5" />
                    <span>Academic Records</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md">
                    <Award className="w-5 h-5" />
                    <span>Co-curricular & Extra-curricular</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md">
                    <Award className="w-5 h-5" />
                    <span>Skills & Certifications</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md">
                    <FileText className="w-5 h-5" />
                    <span>My Approvals / Status</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md">
                    <BookOpen className="w-5 h-5" />
                    <span>Reports</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-md">
                    <Settings className="w-5 h-5" />
                    <span>Settings / Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-9 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Total Activities Logged</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats?.total || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-gray-800">{user?.statistics?.pendingApprovals || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-gray-600 text-sm font-medium mb-2">Credits Earned</h3>
                  <p className="text-3xl font-bold text-gray-800">{user?.totalCredits || 0}</p>
                </div>
              </div>

              {/* Student Profile Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Student Profile</h2>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800 font-medium">{user?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800 font-medium">{user?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Program / Semester</p>
                        <p className="text-gray-800 font-medium">
                          {user?.program || 'N/A'} - Sem {user?.semester || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Roll No</p>
                        <p className="text-gray-800 font-medium">{user?.rollNo || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-gray-800 font-medium">{user?.department?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mentor</p>
                        <p className="text-gray-800 font-medium">{user?.mentor?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stanor</p>
                        <p className="text-gray-800 font-medium">{user?.stanor || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium">Attendance</p>
                    <p className="text-2xl font-bold text-gray-800">{user?.attendance || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Three Column Layout */}
              <div className="grid grid-cols-3 gap-4">
                {/* Academic Records Overview */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Records Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Semester</span>
                      <span className="text-sm text-gray-600">Courses</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Sem {user?.semester || '1'}</span>
                        <span className="text-gray-700">-</span>
                      </div>
                    </div>
                    <div className="pt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Grades</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Credits</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Co-curricular / Extra-curricular Activity Chart
                  </h3>
                  <div className="h-48">
                    {monthlyActivityData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyActivityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="activities" fill="#0ea5e9" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No activity data
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills & Certifications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Certifications</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Uploaded Certificates</p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-800">
                          {stats?.byType?.certification || 3}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Last Uploaded</p>
                      <div className="w-16 h-16 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;
