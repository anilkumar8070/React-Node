import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from 'axios';
import { BookOpen, Send, Users, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const FacultyMessages = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMyClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassMessages(selectedClass._id);
    }
  }, [selectedClass]);

  const fetchMyClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/classes/my-classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassMessages = async (classId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/messages/class/${selectedClass._id}`,
        { message: newMessage, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Message sent to all students in the class!');
      setNewMessage('');
      setPriority('normal');
      fetchClassMessages(selectedClass._id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Class Messages</h1>
            <p className="text-gray-600">Send messages and announcements to your classes</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Class List Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Your Classes
                </h2>
                <div className="space-y-3">
                  {classes.map((classItem) => (
                    <button
                      key={classItem._id}
                      onClick={() => setSelectedClass(classItem)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedClass?._id === classItem._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800">{classItem.code}</h3>
                          <p className="text-sm text-gray-600">{classItem.name}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{classItem.totalStudents}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  {classes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No classes assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="col-span-12 lg:col-span-8">
              {selectedClass ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col" style={{ height: '600px' }}>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                    <h2 className="text-xl font-bold">{selectedClass.code} - {selectedClass.name}</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Send messages to {selectedClass.totalStudents} students in this class
                    </p>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`rounded-lg p-4 ${
                            msg.priority === 'urgent'
                              ? 'bg-red-50 border-l-4 border-red-500'
                              : msg.priority === 'important'
                              ? 'bg-yellow-50 border-l-4 border-yellow-500'
                              : 'bg-white border-l-4 border-blue-500'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {msg.sender.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {new Date(msg.createdAt).toLocaleString()}
                              </p>
                              {msg.priority !== 'normal' && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  msg.priority === 'urgent' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                                }`}>
                                  {msg.priority.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-800">{msg.message}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Sent to {msg.recipients.length} students • Read by {msg.readBy.length}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                          <p>No messages yet. Start a conversation!</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
                    <div className="mb-3">
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message to the class..."
                        rows="3"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Select a Class
                  </h3>
                  <p className="text-gray-500">
                    Choose a class from the left to view and send messages
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FacultyMessages;
