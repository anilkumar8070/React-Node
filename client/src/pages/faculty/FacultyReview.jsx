import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Award,
  Calendar,
  User,
  FileText
} from 'lucide-react';

const FacultyReview = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    reviewComments: '',
    score: ''
  });
  const [filters, setFilters] = useState({
    status: 'pending',
    type: '',
    semester: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${API_URL}/faculty/activities?${queryString}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActivities(response.data.activities || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (activity) => {
    setSelectedActivity(activity);
    setReviewForm({
      status: '',
      reviewComments: '',
      score: activity.score || ''
    });
    setReviewModal(true);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/faculty/activities/${selectedActivity._id}/review`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Activity reviewed successfully');
      setReviewModal(false);
      setSelectedActivity(null);
      fetchActivities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to review activity');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 flex items-center gap-2">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
            Review Activities
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Review and approve student activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="">All Status</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="certification">Certification</option>
              <option value="internship">Internship</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
              <option value="project">Project</option>
              <option value="research">Research</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
            </select>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-sm sm:text-base text-gray-600">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">No activities to review</h3>
              <p className="text-sm sm:text-base text-gray-600">There are no activities matching your filters</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {activities.map((activity) => (
                  <div key={activity._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span className="truncate">{activity.student?.name}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 truncate">{activity.title}</h3>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{activity.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {activity.type}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.startDate).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Award className="w-3 h-3 text-yellow-500" />
                        {activity.score || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => openReviewModal(activity)}
                      className="w-full mt-3 text-xs px-3 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <tr key={activity._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{activity.student?.name}</div>
                              <div className="text-sm text-gray-500">{activity.student?.rollNo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{activity.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs capitalize">
                            {activity.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(activity.startDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(activity.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-semibold">{activity.score || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => openReviewModal(activity)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Review Modal */}
        {reviewModal && selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Review Activity</h2>

                {/* Activity Details */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">{selectedActivity.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">{selectedActivity.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500">Student:</span>
                      <span className="ml-2 font-medium">{selectedActivity.student?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium capitalize">{selectedActivity.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium capitalize">{selectedActivity.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Level:</span>
                      <span className="ml-2 font-medium capitalize">{selectedActivity.level}</span>
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <form onSubmit={handleReview} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Decision</label>
                    <select
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select decision</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Score</label>
                    <input
                      type="number"
                      value={reviewForm.score}
                      onChange={(e) => setReviewForm({ ...reviewForm, score: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter score"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Comments</label>
                    <textarea
                      value={reviewForm.reviewComments}
                      onChange={(e) => setReviewForm({ ...reviewForm, reviewComments: e.target.value })}
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Add your review comments..."
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="submit"
                      className="flex-1 text-sm sm:text-base bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewModal(false)}
                      className="px-6 py-2 text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FacultyReview;
