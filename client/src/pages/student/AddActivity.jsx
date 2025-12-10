import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createActivity } from '../../redux/slices/activitySlice';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { PlusCircle, Upload } from 'lucide-react';

const AddActivity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'certification',
    title: '',
    description: '',
    category: 'co-curricular',
    startDate: '',
    endDate: '',
    organizer: '',
    location: '',
    level: 'college',
    achievementType: 'participation',
    certificateNumber: '',
    githubLink: '',
    semester: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createActivity(formData)).unwrap();
      toast.success('Activity added successfully!');
      navigate('/activities');
    } catch (error) {
      toast.error(error || 'Failed to add activity');
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <PlusCircle className="w-6 h-6" />
              Add New Activity
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="curricular">Curricular</option>
                    <option value="co-curricular">Co-curricular</option>
                    <option value="extra-curricular">Extra-curricular</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter activity title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your activity"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter organizer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="department">Department</option>
                    <option value="college">College</option>
                    <option value="university">University</option>
                    <option value="state">State</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/activities')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddActivity;
