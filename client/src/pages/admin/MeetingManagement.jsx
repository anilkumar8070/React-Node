import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Calendar, Clock, Users, Video, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const MeetingManagement = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
    type: 'physical',
    meetingLink: '',
    attendees: []
  });

  useEffect(() => {
    fetchMeetings();
    fetchUsers();
  }, []);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/meetings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(response.data.meetings || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculty(response.data.users.filter(u => u.role === 'faculty'));
      setStudents(response.data.users.filter(u => u.role === 'student'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/meetings', meetingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Meeting created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchMeetings();
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/meetings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Meeting deleted successfully');
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error('Failed to delete meeting');
    }
  };

  const resetForm = () => {
    setMeetingData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      location: '',
      type: 'physical',
      meetingLink: '',
      attendees: []
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPastMeeting = (date, time) => {
    const meetingDateTime = new Date(`${date} ${time}`);
    return meetingDateTime < new Date();
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Calendar className="w-10 h-10 text-blue-600" />
                Meeting Management
              </h1>
              <p className="text-gray-600">Schedule and manage meetings with faculty and students</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Schedule Meeting
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Meetings</p>
                  <p className="text-3xl font-bold text-gray-800">{meetings.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-green-600">
                    {meetings.filter(m => !isPastMeeting(m.date, m.time)).length}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Online Meetings</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {meetings.filter(m => m.type === 'online').length}
                  </p>
                </div>
                <Video className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Avg Attendees</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {meetings.length > 0
                      ? Math.round(meetings.reduce((sum, m) => sum + (m.attendees?.length || 0), 0) / meetings.length)
                      : 0}
                  </p>
                </div>
                <Users className="w-12 h-12 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Meetings List */}
          <div className="grid grid-cols-1 gap-6">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
                  isPastMeeting(meeting.date, meeting.time)
                    ? 'border-gray-400 opacity-75'
                    : 'border-blue-600'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{meeting.title}</h3>
                      <p className="text-gray-600 mb-4">{meeting.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteMeeting(meeting._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-700 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">Date</span>
                      </div>
                      <p className="text-gray-800 font-medium">{formatDate(meeting.date)}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">Time</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {meeting.time} ({meeting.duration} min)
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-purple-700 mb-1">
                        {meeting.type === 'online' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="text-sm font-semibold">Location</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {meeting.type === 'online' ? 'Online Meeting' : meeting.location}
                      </p>
                      {meeting.type === 'online' && meeting.meetingLink && (
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 text-sm hover:underline"
                        >
                          Join Link
                        </a>
                      )}
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-orange-700 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-semibold">Attendees</span>
                      </div>
                      <p className="text-gray-800 font-medium">{meeting.attendees?.length || 0} participants</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {meetings.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Meetings Scheduled</h3>
                <p className="text-gray-600">Click "Schedule Meeting" to create your first meeting</p>
              </div>
            )}
          </div>

          {/* Create Meeting Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Schedule New Meeting</h2>
                  <p className="text-blue-100 mt-2">Fill in the meeting details</p>
                </div>
                <form onSubmit={handleCreateMeeting} className="p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Meeting Title *</label>
                    <input
                      type="text"
                      value={meetingData.title}
                      onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., Faculty Discussion"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                      value={meetingData.description}
                      onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      rows="3"
                      placeholder="Meeting agenda and details"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Date *</label>
                      <input
                        type="date"
                        value={meetingData.date}
                        onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Time *</label>
                      <input
                        type="time"
                        value={meetingData.time}
                        onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={meetingData.duration}
                      onChange={(e) => setMeetingData({ ...meetingData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      min="15"
                      step="15"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Meeting Type *</label>
                    <select
                      value={meetingData.type}
                      onChange={(e) => setMeetingData({ ...meetingData, type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="physical">Physical</option>
                      <option value="online">Online</option>
                    </select>
                  </div>

                  {meetingData.type === 'physical' ? (
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Location *</label>
                      <input
                        type="text"
                        value={meetingData.location}
                        onChange={(e) => setMeetingData({ ...meetingData, location: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Conference Room A"
                        required={meetingData.type === 'physical'}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Meeting Link</label>
                      <input
                        type="url"
                        value={meetingData.meetingLink}
                        onChange={(e) => setMeetingData({ ...meetingData, meetingLink: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="https://zoom.us/j/..."
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                    >
                      Schedule Meeting
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

export default MeetingManagement;
