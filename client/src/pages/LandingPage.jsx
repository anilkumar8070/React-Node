import { Link } from 'react-router-dom';
import { Award, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage = () => {
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
            <Link
              to="/signup"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Get Started
            </Link>
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
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 font-semibold"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
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
    </div>
  );
};

export default LandingPage;
