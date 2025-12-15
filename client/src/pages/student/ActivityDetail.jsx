import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivity, uploadDocuments } from '../../redux/slices/activitySlice';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  FileText,
  ExternalLink
} from 'lucide-react';

const ActivityDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentActivity, isLoading } = useSelector((state) => state.activities);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getActivity(id));
    }
  }, [dispatch, id]);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }

    try {
      setUploading(true);
      await dispatch(uploadDocuments({ id, formData })).unwrap();
      toast.success('Documents uploaded successfully');
      dispatch(getActivity(id));
    } catch (error) {
      toast.error(error || 'Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${badge.color} font-medium`}>
        <Icon className="w-5 h-5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading || !currentActivity) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => navigate('/activities')}
              className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 mb-3 sm:mb-4"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Activities
            </button>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-words">
                  {currentActivity.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">{currentActivity.description}</p>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(currentActivity.status)}
              </div>
            </div>
          </div>

          {/* Main Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Activity Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                <p className="text-gray-900 capitalize">{currentActivity.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                <p className="text-gray-900 capitalize">{currentActivity.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {new Date(currentActivity.startDate).toLocaleDateString()}
                </div>
              </div>
              {currentActivity.endDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">End Date</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {new Date(currentActivity.endDate).toLocaleDateString()}
                  </div>
                </div>
              )}
              {currentActivity.organizer && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Organizer</label>
                  <p className="text-gray-900">{currentActivity.organizer}</p>
                </div>
              )}
              {currentActivity.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {currentActivity.location}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Level</label>
                <p className="text-gray-900 capitalize">{currentActivity.level}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Achievement Type</label>
                <p className="text-gray-900 capitalize">{currentActivity.achievementType}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Score</label>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">{currentActivity.score || 0}</span>
                </div>
              </div>
              {currentActivity.semester && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Semester</label>
                  <p className="text-gray-900">{currentActivity.semester}</p>
                </div>
              )}
            </div>

            {currentActivity.certificateNumber && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-1">Certificate Number</label>
                <p className="text-gray-900">{currentActivity.certificateNumber}</p>
              </div>
            )}

            {currentActivity.githubLink && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-1">GitHub Link</label>
                <a
                  href={currentActivity.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  {currentActivity.githubLink}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Review Section */}
          {currentActivity.status !== 'pending' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Review</h2>
              <div className="space-y-4">
                {currentActivity.reviewedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Reviewed By</label>
                    <p className="text-gray-900">{currentActivity.reviewedBy.name}</p>
                  </div>
                )}
                {currentActivity.reviewComments && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Comments</label>
                    <p className="text-gray-900">{currentActivity.reviewComments}</p>
                  </div>
                )}
                {currentActivity.reviewedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Reviewed At</label>
                    <p className="text-gray-900">{new Date(currentActivity.reviewedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Documents</h2>
            
            {currentActivity.status === 'pending' && (
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Upload Supporting Documents</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-primary-600 flex-shrink-0"></div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload certificates, photos, or other relevant documents (Max 5 files)</p>
              </div>
            )}

            {currentActivity.documents && currentActivity.documents.length > 0 ? (
              <div className="space-y-2">
                {currentActivity.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700">{doc.originalName || `Document ${index + 1}`}</span>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No documents uploaded yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActivityDetail;
