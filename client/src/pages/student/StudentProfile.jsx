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

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const StudentProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.activities);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  useEffect(() => {
    dispatch(getMe());
    dispatch(getActivityStats());
  }, [dispatch]);

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
