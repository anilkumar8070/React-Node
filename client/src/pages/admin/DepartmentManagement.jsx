import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Building2, Plus, Edit, Trash2, Users, BookOpen, Award, TrendingUp, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    hod: '',
    email: '',
    phone: '',
    building: '',
    floor: ''
  });
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchFaculty();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users?role=faculty', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculty(response.data.users || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (isEditing && selectedDept) {
        await axios.put(
          `/api/admin/departments/${selectedDept._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Department updated successfully');
      } else {
        await axios.post(
          '/api/admin/departments',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Department created successfully');
      }
      
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error(error.response?.data?.message || 'Failed to save department');
    }
  };

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      hod: dept.hod?._id || '',
      email: dept.email || '',
      phone: dept.phone || '',
      building: dept.building || '',
      floor: dept.floor || ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (deptId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/departments/${deptId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      hod: '',
      email: '',
      phone: '',
      building: '',
      floor: ''
    });
    setIsEditing(false);
    setSelectedDept(null);
    setShowModal(false);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Building2 className="w-10 h-10 text-blue-600" />
                Department Management
              </h1>
              <p className="text-gray-600">Manage academic departments and their details</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Department
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Departments</p>
                  <p className="text-3xl font-bold text-gray-800">{departments.length}</p>
                </div>
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Active Departments</p>
                  <p className="text-3xl font-bold text-green-600">
                    {departments.filter(d => d.isActive !== false).length}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Faculty</p>
                  <p className="text-3xl font-bold text-purple-600">{faculty.length}</p>
                </div>
                <Users className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">With HOD</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {departments.filter(d => d.hod).length}
                  </p>
                </div>
                <Award className="w-12 h-12 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search departments by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <div
                key={dept._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Department Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{dept.name}</h3>
                        <p className="text-blue-100 text-sm">{dept.code}</p>
                      </div>
                    </div>
                  </div>
                  {dept.description && (
                    <p className="text-sm text-blue-100 line-clamp-2">{dept.description}</p>
                  )}
                </div>

                {/* Department Details */}
                <div className="p-6 space-y-4">
                  {/* HOD */}
                  {dept.hod && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Award className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-xs text-green-600 font-semibold">Head of Department</p>
                        <p className="text-sm font-medium text-gray-800">{dept.hod.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2">
                    {dept.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>{dept.email}</span>
                      </div>
                    )}
                    {dept.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>{dept.phone}</span>
                      </div>
                    )}
                    {dept.building && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span>Building: {dept.building} {dept.floor && `- Floor ${dept.floor}`}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Students</p>
                      <p className="text-lg font-bold text-gray-800">{dept.studentCount || 0}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Faculty</p>
                      <p className="text-lg font-bold text-gray-800">{dept.facultyCount || 0}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDepartments.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Departments Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Create your first department to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Department
                </button>
              )}
            </div>
          )}

          {/* Create/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">
                    {isEditing ? 'Edit Department' : 'Create New Department'}
                  </h2>
                  <p className="text-blue-100 mt-2">Fill in the department details</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Department Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Computer Science"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Department Code *</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., CSE"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        rows="3"
                        placeholder="Brief description of the department"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">Head of Department</label>
                      <select
                        value={formData.hod}
                        onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select HOD</option>
                        {faculty.map(f => (
                          <option key={f._id} value={f._id}>
                            {f.name} ({f.employeeId})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="dept@university.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="+91 1234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Building</label>
                      <input
                        type="text"
                        value={formData.building}
                        onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Academic Block A"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Floor</label>
                      <input
                        type="text"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., 2nd Floor"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                    >
                      {isEditing ? 'Update Department' : 'Create Department'}
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

export default DepartmentManagement;
