import { Link } from 'react-router-dom';
import { Award, Users, BarChart3, CheckCircle, ArrowRight, GraduationCap, UserCheck, Shield } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
              SAP
            </div>
            <span className="text-xl font-bold text-gray-800">Student Activity Platform</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Login
            </Link>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Centralized Digital Platform for
            <span className="text-primary-600"> Student Activities</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Record, track, and showcase all your academic, co-curricular, and extra-curricular
            achievements in one place. Get faculty approvals and generate comprehensive reports.
          </p>
          <button
            onClick={() => setShowRoleModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 font-semibold"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Activity Tracking</h3>
            <p className="text-gray-600">
              Log all activities including certifications, internships, workshops, and achievements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Faculty Approval</h3>
            <p className="text-gray-600">
              Get your activities verified and approved by faculty mentors easily.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-gray-600">
              Generate comprehensive reports and track your progress with visual analytics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Badge System</h3>
            <p className="text-gray-600">
              Earn badges and recognition based on your activity scores and achievements.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Student Activity Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 relative">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Get Started</h2>
            <p className="text-gray-600 mb-8 text-center">Choose your role to continue</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Student Card */}
              <Link
                to="/signup?role=student"
                className="group border-2 border-gray-200 rounded-xl p-6 hover:border-primary-600 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary-600 transition-colors">
                  <GraduationCap className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Student</h3>
                <p className="text-gray-600 text-center text-sm">
                  Track your activities, get approvals, and build your portfolio
                </p>
              </Link>

              {/* Faculty Card */}
              <Link
                to="/signup?role=faculty"
                className="group border-2 border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-green-600 transition-colors">
                  <UserCheck className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Faculty</h3>
                <p className="text-gray-600 text-center text-sm">
                  Review and approve student activities, mentor students
                </p>
              </Link>

              {/* Admin Card */}
              <Link
                to="/signup?role=admin"
                className="group border-2 border-gray-200 rounded-xl p-6 hover:border-purple-600 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-600 transition-colors">
                  <Shield className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Admin</h3>
                <p className="text-gray-600 text-center text-sm">
                  Manage users, departments, and system-wide analytics
                </p>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
