import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Save,
  BookOpen,
  User
} from 'lucide-react';

const ClassDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClassData(response.data.class);
      
      // Initialize attendance state
      const initialAttendance = {};
      response.data.class.students.forEach(student => {
        initialAttendance[student._id] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error('Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));

      await axios.post(
        `/api/classes/${id}/attendance`,
        { attendanceData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Attendance marked successfully!');
      fetchClassDetails(); // Refresh data
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
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

  if (!classData) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <p className="text-gray-600">Class not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/faculty/dashboard')}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{classData.code}</h1>
              <p className="text-gray-600">{classData.name}</p>
            </div>
          </div>

          {/* Class Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-xl font-bold text-gray-800">{classData.students.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lectures Delivered</p>
                  <p className="text-xl font-bold text-gray-800">{classData.totalLectures}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="text-xl font-bold text-gray-800">{classData.subject}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Semester</p>
                  <p className="text-xl font-bold text-gray-800">Sem {classData.semester}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Marking Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Mark Attendance - Lecture {classData.totalLectures + 1}</h2>
              <button
                onClick={handleSubmitAttendance}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {submitting ? 'Saving...' : 'Submit Attendance'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">S.No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Photo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Roll No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Current Attendance</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classData.students.map((student, index) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-800">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {student.profileImage ? (
                            <img src={student.profileImage} alt={student.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">{student.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{student.rollNo}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">
                            {student.attendanceStats.percentage}%
                          </span>
                          <span className="text-xs text-gray-500">
                            ({student.attendanceStats.present}/{student.attendanceStats.total})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleAttendanceChange(student._id, 'present')}
                            className={`p-2 rounded-lg transition ${
                              attendance[student._id] === 'present'
                                ? 'bg-green-100 text-green-600 ring-2 ring-green-500'
                                : 'bg-gray-100 text-gray-400 hover:bg-green-50'
                            }`}
                          >
                            <CheckCircle className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(student._id, 'absent')}
                            className={`p-2 rounded-lg transition ${
                              attendance[student._id] === 'absent'
                                ? 'bg-red-100 text-red-600 ring-2 ring-red-500'
                                : 'bg-gray-100 text-gray-400 hover:bg-red-50'
                            }`}
                          >
                            <XCircle className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(student._id, 'late')}
                            className={`p-2 rounded-lg transition ${
                              attendance[student._id] === 'late'
                                ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-500'
                                : 'bg-gray-100 text-gray-400 hover:bg-yellow-50'
                            }`}
                          >
                            <Clock className="w-6 h-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClassDetailPage;
