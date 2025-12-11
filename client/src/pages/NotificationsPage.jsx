import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import axios from 'axios';
import { MessageSquare, BookOpen, AlertCircle, Bell, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchMyMessages();
    }
  }, [user]);

  const fetchMyMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/messages/my-messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/messages/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'important':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      default:
        return 'bg-white border-l-4 border-blue-500';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'important':
        return <Bell className="w-5 h-5 text-yellow-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
    }
  };

  if (user?.role !== 'student') {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600 mt-2">General notifications page</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Class Messages & Notifications</h1>
            <p className="text-gray-600">Messages from your faculty and class announcements</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* Class List Sidebar */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Your Classes
                  </h2>
                  <div className="space-y-3">
                    {messages.map((classData) => {
                      const unreadCount = classData.messages.filter(
                        msg => !msg.readBy.some(r => r.user === user._id)
                      ).length;

                      return (
                        <button
                          key={classData.class._id}
                          onClick={() => setSelectedClass(classData)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedClass?.class._id === classData.class._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800">{classData.class.code}</h3>
                              <p className="text-sm text-gray-600">{classData.class.name}</p>
                            </div>
                            {unreadCount > 0 && (
                              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {classData.messages.length} message{classData.messages.length !== 1 ? 's' : ''}
                          </div>
                        </button>
                      );
                    })}
                    {messages.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No messages yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Display */}
              <div className="col-span-12 lg:col-span-8">
                {selectedClass ? (
                  <div className="bg-white rounded-xl shadow-md">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
                      <h2 className="text-xl font-bold">{selectedClass.class.code} - {selectedClass.class.name}</h2>
                      <p className="text-blue-100 text-sm mt-1">
                        Messages from faculty
                      </p>
                    </div>

                    {/* Messages */}
                    <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                      {selectedClass.messages.length > 0 ? (
                        selectedClass.messages.map((msg) => {
                          const isRead = msg.readBy.some(r => r.user === user._id);
                          
                          return (
                            <div
                              key={msg._id}
                              onClick={() => !isRead && markAsRead(msg._id)}
                              className={`rounded-lg p-5 transition-all cursor-pointer ${getPriorityColor(msg.priority)} ${
                                !isRead ? 'ring-2 ring-blue-300' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {getPriorityIcon(msg.priority)}
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {msg.sender.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Faculty • {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {msg.priority !== 'normal' && (
                                    <span className={`text-xs px-2 py-1 rounded font-semibold ${
                                      msg.priority === 'urgent' 
                                        ? 'bg-red-200 text-red-800' 
                                        : 'bg-yellow-200 text-yellow-800'
                                    }`}>
                                      {msg.priority.toUpperCase()}
                                    </span>
                                  )}
                                  {isRead && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-800 leading-relaxed">{msg.message}</p>
                              {!isRead && (
                                <p className="text-xs text-blue-600 mt-3 font-medium">
                                  Click to mark as read
                                </p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>No messages in this class yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Select a Class
                    </h3>
                    <p className="text-gray-500">
                      Choose a class from the left to view messages
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
