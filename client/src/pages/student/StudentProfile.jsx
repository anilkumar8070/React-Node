import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, FileText, BookOpen, Award, Settings, LogOut, Camera } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getMe } from '../../redux/slices/authSlice';
import { getActivityStats } from '../../redux/slices/activitySlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import Layout from '../../components/Layout';
import Chatbot from '../../components/Chatbot';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const StudentProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.activities);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState(0);

  useEffect(() => {
    dispatch(getMe());
    dispatch(getActivityStats());
    fetchAttendanceData();
  }, [dispatch]);

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/classes/student/my-attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendanceData(response.data.data || []);
      
      // Calculate overall attendance
      if (response.data.data && response.data.data.length > 0) {
        const totalPresent = response.data.data.reduce((sum, item) => sum + parseInt(item.attendance.present), 0);
        const totalLectures = response.data.data.reduce((sum, item) => sum + parseInt(item.attendance.total), 0);
        const overall = totalLectures > 0 ? ((totalPresent / totalLectures) * 100).toFixed(2) : 0;
        setOverallAttendance(overall);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingProfile(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileImage(response.data.profileImage);
      toast.success('Profile image updated successfully');
      dispatch(getMe());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload profile image');
    } finally {
      setUploadingProfile(false);
    }
  };

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
          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Main Content Area */}
            <div className="col-span-12 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
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
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border-2 border-green-200 p-6">
                  <h3 className="text-green-700 text-sm font-medium mb-2">CGPA</h3>
                  <p className="text-3xl font-bold text-green-800">{user?.cgpa?.toFixed(2) || '0.00'}</p>
                </div>
              </div>

              {/* Assigned Section - Prominent Display */}
              {user?.section && (
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg border-2 border-purple-300 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-white text-lg font-medium mb-1">Assigned Section</h2>
                        <p className="text-purple-100 text-sm">Your current academic section</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl px-8 py-4 shadow-xl">
                      <p className="text-purple-600 text-5xl font-bold">{user.section}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enrolled Sections */}
              {attendanceData.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Enrolled Sections
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {attendanceData.map((classData) => (
                      <div
                        key={classData.class._id}
                        className="bg-white rounded-lg border-2 border-blue-300 px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="text-blue-700 font-bold text-sm">
                              {classData.class.code.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{classData.class.code}</p>
                            <p className="text-xs text-gray-600">{classData.class.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                        <p className="text-sm text-gray-500">Section</p>
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
                    <div className="relative w-32 h-32 bg-gray-200 rounded-full mb-3 flex items-center justify-center group cursor-pointer">
                      {user?.profileImage || profileImage ? (
                        <img
                          src={profileImage || user?.profileImage}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                      <label
                        htmlFor="profile-upload-attendance"
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="w-8 h-8 text-white" />
                      </label>
                      <input
                        id="profile-upload-attendance"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                        disabled={uploadingProfile}
                      />
                    </div>
                    <p className="text-gray-700 font-medium">Overall Attendance</p>
                    <p className={`text-3xl font-bold ${
                      overallAttendance >= 75 ? 'text-green-600' : 
                      overallAttendance >= 60 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {overallAttendance}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendance Details by Class */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Class-wise Attendance
                </h3>
                <div className="space-y-4">
                  {attendanceData.length > 0 ? (
                    attendanceData.map((classData) => (
                      <div key={classData.class._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-800">{classData.class.code}</h4>
                            <p className="text-sm text-gray-600">{classData.class.name}</p>
                            <p className="text-xs text-gray-500">Faculty: {classData.class.faculty?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${
                              classData.attendance.percentage >= 75 ? 'text-green-600' : 
                              classData.attendance.percentage >= 60 ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {classData.attendance.percentage}%
                            </p>
                            <p className="text-xs text-gray-500">
                              {classData.attendance.present}/{classData.attendance.total} Lectures
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="bg-green-50 rounded p-2">
                            <p className="text-green-700 font-semibold">{classData.attendance.present}</p>
                            <p className="text-xs text-gray-600">Present</p>
                          </div>
                          <div className="bg-red-50 rounded p-2">
                            <p className="text-red-700 font-semibold">{classData.attendance.absent}</p>
                            <p className="text-xs text-gray-600">Absent</p>
                          </div>
                          <div className="bg-yellow-50 rounded p-2">
                            <p className="text-yellow-700 font-semibold">{classData.attendance.late}</p>
                            <p className="text-xs text-gray-600">Late</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No attendance data available</p>
                    </div>
                  )}
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
                        <span className="text-gray-700">{attendanceData.length}</span>
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
      <Chatbot />
    </Layout>
  );
};

export default StudentProfile;
